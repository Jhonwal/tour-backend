<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservation Confirmation</title>
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
        .email-header img {
            max-width: 100px;
            margin-bottom: 10px;
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
        .notice-box {
            background-color: #fff8e1;
            border: 2px dashed #ff9f43;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            color: #444444;
            margin-top: 30px;
        }
        .notice-box strong {
            color: #ff6f00;
            font-size: 18px;
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
        a {
            color: #ff6f00;
            text-decoration: underline;
        }
        /* Responsive Design */
        @media (max-width: 768px) {
            .email-container {
                width: 90%;
                margin: 10px auto;
            }
            .email-header h2 {
                font-size: 22px;
            }
            .email-body {
                padding: 20px;
            }
            .email-body h4 {
                font-size: 20px;
            }
            .email-body p {
                font-size: 14px;
            }
            .notice-box {
                padding: 15px;
            }
        }
        @media (max-width: 480px) {
            .email-header img {
                max-width: 80px;
            }
            .email-header h2 {
                font-size: 18px;
            }
            .email-body h4 {
                font-size: 18px;
            }
            .email-body p {
                font-size: 14px;
            }
            .notice-box {
                font-size: 14px;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="email-header">
            <img src={{ asset('images/waguer.png') }} alt="Sharming Morocco Tours Logo">
            <h2>Sharming Morocco Tours</h2>
        </div>

        <!-- Body Section -->
        <div class="email-body">
            <h4>Dear {{ $userName }},</h4>
            <p>Thank you for choosing <strong>Sharming Morocco Tours</strong>! Your reservation has been successfully created.</p>
            <p>We are thrilled to assist you in creating an unforgettable journey. Below is your reservation reference code:</p>
            <div class="reference">
                {{ $reference }}
            </div>
            
            <!-- Notice Section -->
            <div class="notice-box">
                <p><strong>Important Notice:</strong></p>
                <p>Your reservation request is currently being <strong>reviewed by our dedicated team</strong>. We will notify you as soon as possible with an update regarding the <strong>status of your reservation</strong>.</p>
                <p>Thank you for your patience and trust in Sharming Morocco Tours!</p>
            </div>
            
            <p>If you have any questions or need further assistance, feel free to <a href="mailto:support@sharmingmorocco.com">contact us</a>. We’re always happy to help!</p>
        </div>

        <!-- Footer Section -->
        <div class="email-footer">
            <p>&copy; {{ date('Y') }} Sharming Morocco Tours. All rights reserved.</p>
            <p>Visit us at <a href="https://www.sharmingmorocco.com">sharmingmorocco.com</a></p>
        </div>
    </div>
</body>
</html>
