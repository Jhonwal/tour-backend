<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tour Request Response</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; background-color: #f6f9fc; color: #333;">
    <!-- Main Container -->
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background-color: #ff8725; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Tour Request Update</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px; background-color: #ffffff;">
            <div style="margin-bottom: 30px;">
                <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">Dear {{ $tourRequest->full_name }},</h2>
                
                <div style="color: #475569; font-size: 16px; line-height: 1.8;">
                   {{ $emailMessage }}
                </div>
            </div>

            <!-- Trip Details Summary -->
            <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Your Trip Details</h3>
                <div style="color: #64748b;">
                    <p style="margin: 8px 0;"><strong>Travel Dates:</strong> {{ \Carbon\Carbon::parse($tourRequest->arrival_date)->format('M d, Y') }} - {{ \Carbon\Carbon::parse($tourRequest->departure_date)->format('M d, Y') }}</p>
                    <p style="margin: 8px 0;"><strong>Duration:</strong> {{ $tourRequest->duration }} days</p>
                    <p style="margin: 8px 0;"><strong>Travelers:</strong> {{ $tourRequest->travelers }} person(s)</p>
                    <p style="margin: 8px 0;"><strong>Destinations:</strong> {{ implode(', ', json_decode($tourRequest->destinations)) }}</p>
                </div>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ config('app.frontend') }}" style="display: inline-block; background-color: #ff8725; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Visit Our Website</a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 30px 20px; text-align: center;">
            <div style="margin-bottom: 20px;">
                <h4 style="color: #1e293b; margin: 0 0 10px 0; font-size: 16px;">Contact Us</h4>
                <p style="color: #64748b; margin: 5px 0;">Email: contact@charmingtours2morocco.com</p>
                <p style="color: #64748b; margin: 5px 0;">Phone: +1 (312) 414-6237</p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; margin: 0; font-size: 14px;">© {{ date('Y') }} Charming Tours 2 Morocco. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>