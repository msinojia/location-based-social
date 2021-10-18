var SparkPost = require("sparkpost");
import "babel-polyfill";
const key = "8ebfdf305a25226f0993e870beb597bb30bb669c";
const client = new SparkPost("12081b3d496f54e3b6de32f37b322e13e63b34ad");

export const sendEmail = async (recipient, url) => {
	const response = await client.transmissions.send({
		options: {
			sandbox: true
		},
		content: {
			from: "testing@sparkpostbox.com",
			subject: "Password reset request",
			html: `<html>
        <body>
        <p>Use ${url} as your forgot password OTP. OTP is confidential. Flock never calls you asking for OTP. Sharing it with anyone gives them full access to your Flock account.!</p>
        
        </body>
        </html>`
		},
		recipients: [{ address: recipient }]
	});
	console.log(response);
};
