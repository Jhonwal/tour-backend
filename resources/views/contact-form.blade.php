<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f8f8;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 30px;
            margin-top: 20px;
        }
        .greeting {
            font-size: 24px;
            color: #ff6b00;
            margin-bottom: 20px;
            border-bottom: 2px solid #ff6b00;
            padding-bottom: 10px;
        }
        .notification {
            font-size: 18px;
            color: #666;
            margin-bottom: 25px;
        }
        .content {
            background-color: #fff9f4;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #ffe0cc;
        }
        .field {
            margin-bottom: 15px;
        }
        .field-label {
            font-weight: bold;
            color: #ff6b00;
            margin-bottom: 5px;
        }
        .field-value {
            color: #444;
            padding: 5px 0;
        }
        .message-box {
            background-color: #ffffff;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 4px;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="greeting">
            Dear Admin {{ $adminName }},
        </div>

        <div class="notification">
            A new contact form has been submitted on Charming Tours 2 Morocco.
        </div>

        <div class="content">
            <div class="field">
                <div class="field-label">From:</div>
                <div class="field-value">{{ $data['name'] }} ({{ $data['email'] }})</div>
            </div>

            <div class="field">
                <div class="field-label">Subject:</div>
                <div class="field-value">{{ $data['subject'] }}</div>
            </div>

            <div class="field">
                <div class="field-label">Message:</div>
                <div class="message-box">
                    {{ $data['message'] }}
                </div>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated message from Charming Tours 2 Morocco contact form.</p>
            <p>© {{ date('Y') }} Charming Tours 2 Morocco. All rights reserved.</p>
        </div>
    </div>
</body>
</html>