import emailjs from "@emailjs/browser";
import moment from "moment/moment";

export const reminder = (name, time , type, userEmail) => {

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: type,
      name: name,
      date: moment(time).format("MMMM Do YYYY, h:mm:ss a"),
      phone_number: "+254700716563",
    }),
  };
  const smsReminder = async () => {
    await fetch("http://localhost:8011/", options)
      .then((response) => response.json()).then(()=>sendEmail())
      .catch((err) => console.error(err));
  };
    const sendWhatsapp = async () => {
    await fetch("http://localhost:8011/whatsapp", options)
      .then((response) => response.json())
      .catch((err) => console.error(err));
  };

  const sendEmail = () => {   
    if (
      moment(time).format("MMMM Do YYYY, h:mm:ss a") >
      moment().format("MMMM Do YYYY, h:mm:ss a")
    ) {
      emailjs
        .send(
          process.env.REACT_APP_SERVICE_ID,
          process.env.REACT_APP_TEMPLATE_ID,
          templateParams,
          process.env.REACT_APP_PUBKEY_EMAILJS
        )
        .then(function (response) {
          sendWhatsapp();
          console.log("SUCCESS!", response.status, response.text);
        })
        .error((error) => console.log(error.message));
    }
  };

  const templateParams = {
    to_email: userEmail,
    time: moment(time).format("MMMM Do YYYY, h:mm:ss a"),
    task_name: `${type === "event" ? "EVENT" : "TASK"} : ${name}`,
  };

  smsReminder();
  return;
};
