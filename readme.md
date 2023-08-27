För G krävs följande:

Användning av hashning via SHA256 ::: OK
ProofOfWork ::: OK
Manipulering av blockkedjan via ett API ::: OK
Blockkedjan ska ha stöd för minst 3 noder i ett distribuerat nätverk. ::: OK
En concensus algorithm ska användas samt en valideringsfunktion för blocken i kedjan
Validera datat så att det inte är manipulerat
Validera hash för blocken så att de inte är manipulerade
Validera föregående block så att det överstämmer med aktuellt block och ordning samt att hashen inte är förändrad eller manipulerad
 

För VG krävs:

Att “best practices” används, vilket innebär att Single Responsible Principles samt Separations Of Concern ska användas.

Detta betyder till exempel att logiken för ett API ska separeras i Controller funktioner, Routing funktioner.

I guess ::::: OK