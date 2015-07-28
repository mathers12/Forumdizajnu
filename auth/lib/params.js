/**
 * Created by ubuntu on 2/10/15.
 */


module.exports =
{
    SMTP:
    {
        user: "info@publishart.eu",
        pass: "publishart@2714info2517"
    },
    email:
    {
        from: "Live My Way Ltd. <info@publishart.eu>",
        subject: "Verifikacia e-mailu",
        subjectInvitation: 'Pozvánka od systému T-res',
        subjectForgotPassword: "Resetovanie hesla",
        footer: "dSoft Solutions s.r.o",
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
        approving: "<p>Registracia bola skoro dokoncena. Potvrdte verifikacny e-mail prosim.</p>",
        success: "<p>Registracia bola uspesne dokoncena, mozete sa prihlasit.</p>",
        existEmail: "Zadana e-mailova adresa uz existuje",
        matchPassword: "Nezhoduju sa Vam hesla"
    },
    login:
    {
        verifiedEmail: "E-malova adresa este nie je potvrdena, prosim potvrdte ju najskor",
            badUserOrPass: "Neplatne uzivatelske meno alebo heslo"
    }

};
