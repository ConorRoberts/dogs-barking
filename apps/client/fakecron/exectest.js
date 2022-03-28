const {spawn} = require('child_process');
const nodemailer = require('nodemailer');

const test_hack = spawn("npm", ["test"], {shell: true});

const passedTests = [];
const failedTests = [];

test_hack.stdout.on("data", (data) => {
    console.log("Testing" + data);
});

test_hack.stderr.on( "data", (data) => {
    const substr = data.slice(0, 5);

    if (substr.toString().includes("PASS")) {
        passedTests.push(data.slice(5, data.length - 1).toString());
    } else if (substr.toString().includes("FAIL")){
        failedTests.push(data.slice(5, data.length - 1).toString());
    }
});

test_hack.on("close", (code) =>{
    if (failedTests.length > 0) {
        let message = "Hello, Just checking in on your web app. Its scuffed";
        let body = failedTests.join("\n");
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dogsbarkinginc@gmail.com', 
                pass: 'typescript'
            }
        });
        const mailOptions = {from: "dogsbarkinginc@gmail.com", to:"carlsonb@uoguelph.ca", subject: message, text: body};
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Mail sent successfully" + info.response)
            }
        });
    }
    console.log("Testing finished with code " + code);
});
