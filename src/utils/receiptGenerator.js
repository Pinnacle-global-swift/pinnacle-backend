export const generateReceipt = async (transaction) => {
    const date = new Date(transaction.createdAt).toLocaleString();

    return `

  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PINNACLE GLOBAL SWIFT - Transaction Receipt</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2A69ED; padding: 30px 40px; text-align: center;">
                            <img src="https://firebasestorage.googleapis.com/v0/b/first-project-a5bbf.appspot.com/o/pgb.png?alt=media&token=1a9dcde5-62a3-4eaf-9c96-9cd3d56f2b64text=Pinnacle+Global+Bank" alt="PINNACLE GLOBAL SWIFT Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Transaction Receipt</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <!-- Transaction Status Banner -->
                            <div style="background-color: ${transaction.status.toLowerCase() === 'completed' ? '#e8f5e9' : '#fff3e0'}; border-radius: 8px; padding: 15px; margin-bottom: 30px; text-align: center;">
                                <p style="margin: 0; font-size: 18px; color: ${transaction.status.toLowerCase() === 'completed' ? '#2e7d32' : '#ef6c00'};">
                                    Transaction ${transaction.status}
                                </p>
                            </div>

                            <!-- Amount Display -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <p style="margin: 0 0 5px; color: #666666; font-size: 14px;">Transaction Amount</p>
                                <h2 style="margin: 0; color: #2A69ED; font-size: 36px; font-weight: bold;">$${transaction.amount.toFixed(2)}</h2>
                            </div>

                            <!-- Transaction Details -->
                            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: separate; border-spacing: 0 12px;">
                                    <tr>
                                        <td style="color: #666666;">Transaction ID:</td>
                                        <td style="text-align: right; font-family: monospace; font-weight: bold;">${transaction.reference}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Date & Time:</td>
                                        <td style="text-align: right;">${date}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Type:</td>
                                        <td style="text-align: right;">
                                            <span style="background-color: ${transaction.type.toLowerCase() === 'deposit' ? '#e8f5e9' :
            transaction.type.toLowerCase() === 'withdrawal' ? '#ffebee' : '#e3f2fd'
        }; padding: 4px 12px; border-radius: 12px; font-size: 14px; color: ${transaction.type.toLowerCase() === 'deposit' ? '#2e7d32' :
            transaction.type.toLowerCase() === 'withdrawal' ? '#c62828' : '#1565c0'
        };">
                                                ${transaction.type}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666;">Balance After:</td>
                                        <td style="text-align: right; font-weight: bold;">$${transaction.balanceAfter.toFixed(2)}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- QR Code Placeholder -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="https://via.placeholder.com/150x150.png?text=QR" alt="Transaction QR Code" style="width: 150px; height: 150px;">
                                <p style="margin: 10px 0 0; font-size: 12px; color: #666666;">Scan to verify transaction</p>
                            </div>

                            <!-- Security Notice -->
                            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px;">
                                <p style="margin: 0; font-size: 12px; color: #666666; text-align: center;">
                                    This is an official transaction receipt from PINNACLE GLOBAL SWIFT. 
                                    Please keep this for your records.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 40px; text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} PINNACLE GLOBAL SWIFT. All rights reserved.</p>
                            <p style="margin: 0;">For questions about this transaction, please contact our support team.</p>
                            <p style="margin: 10px 0 0;">
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Download PDF</a> | 
                                <a href="#" style="color: #2A69ED; text-decoration: none;">Print Receipt</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};