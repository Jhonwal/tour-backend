<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Notification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }
        .email-container {
            max-width: 650px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: rgb(255, 184, 52);
            color: #ffffff;
            text-align: center;
            padding: 25px;
        }
        .email-header h2 {
            font-size: 26px;
            margin: 0;
            font-weight: bold;
        }
        .email-body {
            padding: 30px;
            line-height: 1.8;
            color: #333333;
        }
        .email-body h4 {
            font-size: 22px;
            color: #333333;
            margin-bottom: 15px;
        }
        .email-body p {
            font-size: 16px;
            color: #555555;
            margin-bottom: 20px;
        }
        .email-body .reference {
            display: inline-block;
            font-size: 18px;
            font-weight: bold;
            color: #ff6f00;
            background-color: #fff8e1;
            padding: 10px 20px;
            border-radius: 8px;
            margin-top: 10px;
        }
        .email-footer {
            text-align: center;
            padding: 15px;
            background-color: #f9f9f9;
            font-size: 14px;
            color: #888888;
            border-top: 1px solid #e0e0e0;
        }
        .email-footer a {
            color: #ff6f00;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="email-header">
            <h2>New Booking Alert</h2>
        </div>
        @php
            $name = 'waguer';
            $reference = 'SMO34LFMDO';
        @endphp
        <!-- Body Section -->
        <div class="email-body">
            <h4>Dear Admin {{ $name }},</h4>
            <p>A new booking has just been created on <strong>Sharming Morocco Tours</strong>.</p>
            <p>Below is the reservation reference code for your records:</p>
            <div class="reference">
                {{ $reference }}
            </div>
            <p>Please review the details of this booking in the admin dashboard and take the necessary actions.</p>
        </div>

        <!-- Footer Section -->
        <div class="email-footer">
            <p>&copy; {{ date('Y') }} Sharming Morocco Tours. All rights reserved.</p>
            <p>Visit us at <a href="https://www.sharmingmorocco.com">sharmingmorocco.com</a></p>
        </div>
    </div>
</body>
</html>
