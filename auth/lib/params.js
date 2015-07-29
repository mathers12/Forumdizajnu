/**
 * Created by ubuntu on 2/10/15.
 */


module.exports =
{
    SMTP:
    {
        user: "forumdizajnu@gmail.com",
        pass: "something001"
    },
    email:
    {
        from: "Forumdizajnu.sk <forumdizajnu@gmail.com>",
        subject: "Verifikacia e-mailu",
        subjectInvitation: 'Pozvánka od systému Forumdizajnu.sk',
        subjectForgotPassword: "Resetovanie hesla",
        footer: "Forumdizajnu.sk",
        html: {
            titleMale: "Dobrý deň pán",
            titleFemale: "Dobrý deň pani",
            message: "Prosím potvrďte tento",
            subject: "verifikačný e-mail",
            button: "Potvrdiť kliknutím tu!"
        },
        htmlInvitation:{
            title: "Dobrý deň",
            invite: " ste pozvaný používateľom ",
            message: " stať sa ",
            messageAdmin: 'administrátorom',
            messageManager: 'manažerom',
            messageClient: 'klientom',
            subject: "Prosím, potvrdťe tento odkaz a vyplňte svoje údaje.",
            buttonAccept: "Pre prijatie roly potvrdte tento link",
            buttonReject: "Pre zamietnutie roly potvrďte tento link"
        },
        htmlForgotPassword:{
            title: "Dobrý deň",
            message: "požiadali ste o resetovanie hesla, následujúcím odkazom môžete vložiť Vaše nové heslo",
            subject: "Prosím potvrďte tento odkaz",
            button: "Potvrdiť kliknutím tu!"
        }
    },
    register:
    {
        success: "Na úplne dokončenie registrácie, prosím potvrdťe verifikačný e-mail.",
        existEmail: "Zadaná e-mailová adresa už existuje, použite inú prosím.",
        matchPassword: "Prepáčte, ale nezhodujú sa Vám heslá.",
        successTitle: "Úspešne zaregistrovanie",
        existEmailTitle: "Existujúci e-mail",
        matchPasswordTitle: "Nezhoda hesiel"
    },
    login:
    {
        verifiedEmail: "E-mailová adresa ešte stále nie je verifikovaná.",
        badUserOrPass: "Neplatné e-mail alebo heslo"
    }

};
