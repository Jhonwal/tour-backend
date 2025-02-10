<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Status Update</title>
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
        .status-box {
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-top: 30px;
        }
        .status-box.confirmed {
            background-color: #e8f5e9; /* Light green */
            border: 2px solid #4caf50; /* Green */
        }
        .status-box.canceled {
            background-color: #ffebee; /* Light red */
            border: 2px solid #f44336; /* Red */
        }
        .status-box.completed {
            background-color: #e3f2fd; /* Light blue */
            border: 2px solid #2196f3; /* Blue */
        }
        .status-box.pending {
            background-color: #fff8e1; /* Light orange */
            border: 2px dashed #ff6f00; /* Orange */
        }
        .status-box strong {
            font-size: 18px;
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
            <img src={{ public_path('logoEmail.png') }} alt="Charming Tours 2 Morocco Logo">
            <h2>Charming Tours 2 Morocco</h2>
        </div>

        <!-- Body Section -->
        <div class="email-body">
            <h4>Dear {{ $booking->full_name }},</h4>
            <p>Your booking with reference code <span class="reference">{{ $booking->reference_code }}</span> has been updated to the following status:</p>

            <!-- Status Box -->
            <div class="status-box {{ $booking->status }}">
                @if($booking->status === 'confirmed')
                    <strong>Booking Confirmed!</strong>
                    <p>We are delighted to inform you that your booking has been <strong>confirmed</strong>. We look forward to welcoming you on <strong>{{ $booking->arrival_date }}</strong>.</p>
                @elseif($booking->status === 'canceled')
                    <strong>Booking Canceled!</strong>
                    <p>We regret to inform you that your booking has been <strong>canceled</strong>. If this was a mistake, please <a href="mailto:cm2ours@gmail.com">contact us</a> immediately.</p>
                @elseif($booking->status === 'completed')
                    <strong>Booking Completed!</strong>
                    <p>Your booking has been marked as <strong>completed</strong>. We hope you had a wonderful experience with us!</p>
                @endif
            </div>

            <!-- Notice Section -->
            <div class="notice-box">
                @if($booking->status === 'confirmed')
                    <p><strong>What to Do Next:</strong></p>
                    <p>Your booking is now confirmed! Please <strong>download your receipt</strong> from the <a href="https://charmingtours2morocco.com/check-booking">Check Booking</a> section of our website.</p>
                    <p>If you have any special requests or need further assistance, feel free to <a href="mailto:cm2ours@gmail.com">contact us</a>.</p>
                @elseif($booking->status === 'canceled')
                    <p>If you wish to rebook or have any questions, please <a href="mailto:cm2ours@gmail.com">contact us</a>. We are here to help!</p>
                @endif
            </div>

            <p>If you have any questions or need further assistance, feel free to <a href="mailto:cm2ours@gmail.com">contact us</a>. We’re always happy to help!</p>
        </div>

        <!-- Footer Section -->
        <div class="email-footer">
            <p>&copy; {{ date('Y') }} Charming Tours 2 Morocco. All rights reserved.</p>
            <p>Visit us at <a href="https://www.charmingtours2morocco.com">charmingtours2morocco.com</a></p>
        </div>
    </div>
</body>
</html>