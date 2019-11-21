WITH 
A1 AS ( -- EMAIL EXIST? wrong psw or creat account -- ELSE RETURN sumthing
    SELECT CASE WHEN EXISTS (
        SELECT * FROM Credentials
        WHERE email = $1
    )
        THEN ('wrongCreds') -- Pour ne pas dire mauvais mot de passe on dit mauvaise combinaison
        ELSE ('unknownUser') -- n'extiste pas => creer nouveau user
        END
),
A2 AS ( -- UPDATE IP AND LASTCON -- THEN -- RETURN loggedIn
    UPDATE Credentials SET lastCon = LOCALTIMESTAMP, ip = $3
    WHERE email = $1
    RETURNING 'loggedIn' -- logged in
)
SELECT CASE WHEN EXISTS ( -- TRY LOGIN
    SELECT * FROM Credentials 
    WHERE email = $1 AND psw = $2
)
    THEN (
        SELECT * FROM A2
    )
    ELSE (
        SELECT * FROM A1
    )
    END;

