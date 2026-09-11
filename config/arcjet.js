import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

const aj = arcjet({
  // Get your site key from https://console.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_API_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
   detectBot({
      mode: "DRY_RUN",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj; 

/* one imp error fix 
{
  "error": "Bot detected"
}

The important part is this rule in your arcjet.js:

detectBot({
  mode: "LIVE",
  allow: [
    "CATEGORY:SEARCH_ENGINE",
  ],
}),
What's happening

Your middleware does:

const decision = await aj.protect(req, { requested: 1 });

Arcjet checks the request against all 3 rules:

                 Request
                    ↓
              aj.protect()
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
     Shield      detectBot    tokenBucket
                    ↓
              Bot detected
                    ↓
             decision.isDenied()
                    ↓
          decision.reason.isBot()
                    ↓
        HTTP 403 "Bot detected"

Your code specifically says:

if(decision.reason.isBot()) {
    return res.status(403).json({
        error: 'Bot detected'
    });
}

So your code is working correctly. Arcjet is denying the request, and your middleware converts that denial into the JSON response you're seeing.

Why is Postman being detected as a bot?

You're probably testing your API using Postman.

Postman is an automated HTTP client, not a normal browser. Arcjet's detectBot() can therefore identify the request as automated/bot traffic.

And because you have:

mode: "LIVE"

Arcjet actually blocks the request.

If you change it to:

detectBot({
    mode: "DRY_RUN",
    allow: [
        "CATEGORY:SEARCH_ENGINE",
    ],
}),

Arcjet will detect/log the bot but won't block the request because of that bot rule.

For development, I recommend this

While you're testing your Express API with Postman, use:

detectBot({
    mode: "DRY_RUN",
    allow: [
        "CATEGORY:SEARCH_ENGINE",
    ],
}),

Keep your rate limiter and Shield as they are:

const aj = arcjet({
  key: process.env.ARCJET_API_KEY,

  rules: [
    shield({
      mode: "LIVE"
    }),

    detectBot({
      mode: "DRY_RUN",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
      ],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

Now when you use Postman:

Postman
   ↓
Express
   ↓
Arcjet
   ↓
detectBot → detects automated request
   ↓
DRY_RUN → doesn't block
   ↓
Your controller
One important thing

Don't confuse these two:

DRY_RUN
mode: "DRY_RUN"

Means:

"Detect it, but don't block it."

LIVE
mode: "LIVE"

Means:

"Detect it and block it if the rule says it should be blocked."

So your current:

detectBot({
  mode: "LIVE",
})

is not wrong. It's appropriate when your application is deployed and you want actual bot protection.

For learning/testing with Postman, DRY_RUN is much easier.

Also, your middleware itself is fine

This part is correct:

if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
        return res.status(429).json({
            error: 'Rate limit exceeded'
        });
    }

    if (decision.reason.isBot()) {
        return res.status(403).json({
            error: 'Bot detected'
        });
    }

    return res.status(403).json({
        error: 'Access denied'
    });
}

So you don't need to change the middleware just because you're seeing "Bot detected".

The change is mainly in your Arcjet bot rule depending on whether you're developing or deploying.*/
