Rozbehnutie MongoDB po nainstalovani

1. Treba mat zapnuty MongoDB daemon proces
   $ sudo service mongod start
   
2. Následne sa už môžeme napojiť na MongoDB konzolu
   $ mongo

Na pridanie hlavného administrátora do systému nám poslúži MongoDB Shell konzola.
Prejdeme do MongoDB Shell konzoly. Následne sa presunieme do našej databázy a
pomocou príkazu createUser vytvoríme hlavného administrátora.

1. Do terminálu zadáme príkaz, ktorým prejdeme do MongoDB konzoly (Treba mať predtým spustený MongoDB server cez príkaz mongod)
   $ mongo
   
2. Následne sa presunieme do našej databázy, v ktorej chceme vytvoriť administrátora (ak nemame vytvorenu databazu tak automaticky prikazom 
   use databaseName sa nam vytvori daná databáza)
   $ use myDatabase
   
3. Vytvorime uzivatela s menom (v tomto prípade používam e-mail, pretože sa tento admin používal na prihlasovanie do systému cez e-mail), 
   heslom a rolou admin aby nadobudol administrátorske práva

   $ db.createUser({ user: 'something@gmail.com', pwd: '123456', roles: [{ role: 'dbAdmin', db: 'myDatabase'}]})


Kontrola kolekcií a ich dát

1. Spustíme MongoDB shell konzolu
   $ mongo
   
2. Pozrieme si zoznam databaz
   $ show dbs
   
3. Prejdeme na nasu databazu
   $ use myDatabase
   
4. Pozrieme zoznam nasich kolekcii
   $ show collections
   
5. Pozrieme si zoznam nasich dat napr. v kolekcii clients
   $ db.clients.find()
