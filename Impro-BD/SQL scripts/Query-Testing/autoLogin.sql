WITH 
A1 AS ( -- return soit (unknownConn) ou (connTimedOut)
    SELECT CASE WHEN EXISTS (
        SELECT * FROM Credentials
        WHERE ip = $1
    )
        THEN ('timedOut')
        ELSE ('unknownConnection')
        END
),
A2 AS ( -- Return client's email -- DOIT REFRESH LE lasCon!!
    UPDATE Credentials SET lastCon = LOCALTIMESTAMP
    WHERE ip = $1;
    RETURNING (
        SELECT email FROM Credentials
        WHERE ip = $1
    )
) -- logged in
SELECT CASE WHEN EXISTS ( -- TRY LOGIN
    SELECT * FROM Credentials 
    WHERE ip = $1 AND LOCALTIMESTAMP - lastCon > INTERVAL '15 MINUTE'
)
    THEN (
        SELECT * FROM A2
    )
    ELSE (
        SELECT * FROM A1
    )
    END;

