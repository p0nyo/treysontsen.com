const ASCII_PORTRAIT = `xXxx+;+;++++xxxxxXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+XXXxXxxx++xXxXXXXXxx+++;++;;;;;;+xxXxx+xxxXxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xxXXXX
XxXx+;;++++++xxxxXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxXxxXx+++xxxXxxXXXxx++++;;;:::;;;xxx++++;;++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXX
XXXx+;;++++++xxxXXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++xxX++xxxx++;+;;;;:::;+XXXX++::;+x++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXX
XXXx+++++++++xxxXXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxXxxXXx++++Xxx+++;;;;;:::;xXXX+++;;+xx++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXX
XXXx++++++++xxxxXXXXXX+++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxx++xXX+++xXXx++++;;;;:::;+xxx++x+xXx++;+++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXX
XXXx++++++++xxxxXXXXXX++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++++++;+XXXXXXXXx+++++++;;:::;;++;;++++++;;++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+xxXXXXX
XXXx++++++++xxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxXXXXx++++xXXXxxXXXXXx+xxxxx+;;::::::;++++++;;+;+++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++xXXXXX
XXX+++++++++xxxxXXXXXxx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXXXxxxx+xXXXXxx++;+x+++x+;;;;+++++;;;;;+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++xXXXXX
XXX+++++++++xxxxXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+++xXXXXx++++++xXXXXxx++;++;;;+++++++++;;;;;;;+;+++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xxXXXXX
XXX+++++++++xxxxXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx;++XXx++++xxxXXXXXXx+++;;;;;++++++;;;;;;;;;;;+;+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXX
XXX+++++++++xxxxXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+;+XXx++xXXXXXXXXXxx++++;;;;+++;;;;;;;;;;;+;++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXX
XXx+++++++++xxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXXXXXXXXXxx++++++;;++;;;;;;;;;;;;+++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXX
XXx++++++++xxxxXXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx+++++++++;;;;;;;;;;;+;++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXX
XXx++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx++x++xx++;;;;;;;;;;+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXX
XXx++++++++xxxxXXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+x+x+x++x+;;;;;;;;;+xXXxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+xxXXXXXX
XXx++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx+x+++xx+;;;;;;;;++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXX
XX+++++++++xxxxXXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++x+x+x+;;;;;;;;++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
XX+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++x++xx+;;;;++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
Xx+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX++x+x+x++;;+;+xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
Xx+;+++++++xxxxXXXXXXx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++x+xx++;;;+xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXX
Xx++;++++++xxxxXXXXXxx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxXXXXXXXXXXXXxxXx+:::;:        :::::.::.   .:;xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX++xXXXXXXX
Xx+++++++++xxxxXXXXXxx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+++++++;;;;;;;:::::::......                                         ;XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx++xXXXXXXX
Xx++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+;.                                                                          .xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx+++XXXXXXXX
Xx++++++++xxxxxXXXXXxx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+.                                                                             +XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxxx+++xXXXXXXXX
Xx++++++++xxxxxXXXXXxx+++++xXXXXXXXXXXXXxxxxxXXXXXXXXXXXXXXXXXXXX                                                                              :xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxxxxxxx+++++XXXXXXXXXX
Xx++++++++xxxxxXXXXXxx+++++xXXXXXXXXXXXXXx++++++++xxxxxXXXXXXXXX:                                                                              ++xxXXXXXXXXXXXXXXXXXxxxXxxxxxxxxxx+++++++++++XXXXXXXXXXXX
Xx++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXx+++;+;++++++++++xx;                                                                             .+xxxxXXXXXXXXXXXXXXXXXxxx+++++++++++++++++xxXXXXXXXXXXXXXXX
Xx++++++++xxxxxXXXXXxx+++++XXXXXXXXXXXXXXXXXXXXXXXxx++++;++++xx                                                                              xXXXXXXXXXXXXXXXXXXXXXXXXXXXx++++++++xxXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:                                                                             xxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxxXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX+                                                                             xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxXXXXXXXXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXXxXXXXXXXXXXXX                                                                             +xxxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXxxxxXXXXXXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxXXXXXXx++++++XXXXXXXXXXXXXXXXXXXXx+xXXXXXXXXXX;                                                                            +XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+xXXXXXXXXXXXXXXXXXXXXXXXXXX
X+++++++++xxxxXXXXXXx+++++xXXXXXXXXXXXXXXXXXXXXX+xXXXXXXXXX+                                                                            ;xxxxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXXXXXXXXXXXXXXXXXXX
x+++++++++xxxxXXXXXXx+++++xXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXX:                                                                            ;++xxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXXXXXXXXXXXXXXXXXXX
X+;+++++++xxxxXXXXXX++++++++xXXXXXXXXXXXXXXXXXXXxxXXXXXXXx;                                                                           :.;;;+++++++xxxxxXXXXXXXXXXXXXXXXXXXXXXxxXXXXXXXXXXXXXXXXXXXXXXXXXX
x+;++++++xxxxxXXXXXXx++++++XxxXXXXXXXXXXXXXXxxxXxxXXXXX++;                                                                            ;:x++;;;;++++++++++++++++++++++++++++xxxxXXXXXXXXXXXXXXXXXXXXXXXXXx
x++++++++xxxxxXXXXXx+++++++XXXXXXXXXXXXxx++++++xXxXXXXx++:                                                                            :+xxxx++;;;;;;;;;;+++++++++++++++;++++XxxXXXXXx+++xxXXXXXXXXXXXxx++
x+;++++++xxxxxXXXXXx++++++xXXXXXXXXXXx++++++XXXXXxXXXXXx+                                                                             .:;;++xxx++;;;;;;;;+;++++++++++++xXXXXXxxXXXXXxxxx++xXXXXXXXXXXXx+x
x++++++++xxxxxXXXXXx++++++xXXXXXXXXx+++++xXXxxxxxXXXXXXx:                                                                                :;;++xxXXx+xxx+++xxxxxxXXXXXXXXxxXXXXXXXXXXXxXXx+++xxXXXXXXXXXXX
x++++++++xxxxxXXXXXx++++++xxxxxx+++++xXXXXXXxxXXXXxx+++;                                                                     .            .;;;++xXXXXXXXXXXXXXXXXXXXXXXXXXXx++++xXXXXxxXx+XXxx+xxxXXXXXXX
x++++++++++xxxXXXXXxx++++++++++++++xXXXXXXXXXXXx++;;;;;                                                                          .         :;;;++++xxXXXXXXXXXXXXXXXXXXXXXxxx++++++xXXXx++XXXXXx+++xXXXXX
+++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXx++++xxXX+                                                                           .         ;;;+xxXxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxx++xXXXXXXXXXXXXXxx
+++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXX:                                                                            .         ::;+xxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx+++
+++++++++xxxxxXXXXXx++++++xXXXXXXXXXXXXXXXXXXXXXXXXXXX           .::::                                                                         :;++++++xxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx
++++++++xxxxxxXXXXXx+++++xXXXXXXXXXXXXXXXXXXXXXXXXXXXXx;:;xxxxxxxxx++;                                                                          .:::;;;;;++++++++++xxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
++++++++xxxxxxXXXXX+xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxx++++;;;::.                                                                             ...::::::::;;;;;;;+++++++++xxxXXXXXXXXXXXXXXXXXXXXXXXXX
++++++++xxxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXx+XXXXXXxxx+++;;;;;:::::...                                                                              ;+;;;:::::::::::::::::;;;;;;++++++++xxxxXXXXXXXXXXXXXXX
++++++++xxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx+++++;;;;;;:::::::...                                                                                  :+xxxxxxxxx++++;;;:::::::::::::::;;;;;;;;+++++xxxXXXXXXX
++;++xXXXXXXXXXXXXXXXXXXXXXXXXXXxx++++;;;:::::::::::.:..... .  ......                                      ..;+;.                                :++++++xxxxxxxxxxXxxxx++++;;;::::.:::::::;;;;;+++++++++x
++xXXXXXXXXXXXXXXXXXXXXXxxx+++;;;;;;::::::::..:...........:::;;;++++;:                                    .;;+xxxx++++;;;;:.                     .::::::;;;;;;++++++x+xxxxxxxxxXxx+++;;;:::::::::::;;;;;++
XXXXXXXXXXXXXXXXxx+++;;;;;::::::::::::.:.......::::;;;+++++++++++;:.                                   .;+++++xxxx++++++;;::.       ..        .++xxx+++++;;;;;:::;;;;;;+++++++xxxxxxxxxxxxxx+++;;;:::::::
XXXXXXXXxx++++;;;;;:::::::::..:.:...:::::;;;;+++++++++++;;;:::::..                                  ;;;+++++++++++++++++;;;;:::::::::::;:    .::;;;;++++++xxxxxxx+++;;;;:::;;;;;+++++++++xxxxxxXXXXxx+++;
XXx+++;;;;;:::::::.:........::::;;;+++++++++++;;;;:::::......::::..                               .:+++++++++++++++++++;;;;;::::++++;::;;:  :;;;;;;;;:::::;;;;;+++++xxxxxxx+++;;;;;::;;;;;;+++++++xxxxxxX
;;;;;::::::::.......:::::;;+++xx+++++;;;::::.......:::;;;++++++;;                   ;:. .       :::;+++++++++++++++++;;;;;;:::.:++;.   ...;;;;;;;;;;;;;+++;;;;;;:::::;;;;;++++xxxxxx+++;;::::::;;;;++++++
::::::.......::::;;;++++x++++;;;:::::.....::::;;+++++++;;;;::::.                     :;;;;:::. :;;;;;+++++x+x++++++++;++;;;::::;;:.       ++++++xxx++++;;;;;;;;;;+++++;;;;;::::;;;;+++++xxx+++;;;::::::;;
..:::::::;;+++++++++++;;;::::......:::;;+++++;;;;;::::::........                       :+++;;:.:;+;++++++x+++++++++++++++;;;;;;+++;;;:   ;+xxxxxxx+++++++xx+xx++++;;;;;;;;;+++++;;;::::::;;;+++++x+++++;;
::;;;++++++++;;;::::......::::;;;+++++;;;::::..::.::::..:........  .                     .:;:.::;+++++++++++++++++++++++;;;;;;;;;;;;;+;:::::;;;;;++++xxxxxxxx++++++++++x++++;;;;;;;;;;;;;;;:::::::;;;++++
++++++;;;:::::.....::;;;+++++;;;;:::::.::::::...:....::::::::::::                             .;;;++++++++++++++++++++++++;;;:::::::::.::::::::::::::;;;;;;;++++xxxxxxxx++++++x+x+++++;;;;;;;;+;;;;::::::
;;:::::....:::;;++++++;;;:::::.:.:::::.....:::::::::;;;;+++++x++:                             :+++++++++++++++++++++++++;;;::.          .:::::::::::::::::;:;:;;;;;;;;+++xxxXxxxxx++++++++++;;;;;:;;;;;;;
:...:::;;++++++;;;:::.:.:::::.......:::;;;;;;+;;+++xxxx+++;;;::::..                       .;;;+++;;+++++++++++++++;+;;;;:::...:;;;;;;:...:.:::::::::::::::::::::::::;;;;;;;;;;;++++x+xx++++++++++++++;;;:
:::;++++;;;::::..:::.:......:::::;;;++++++xxxx+++;;;:::::::.:.:....                      .;++++++;;;;;;;;;;;;;;;;;;;;::::.::::;;:::.....:.::::::::::::::::::::::::::::::::::;::;;;;::;;;;;++++x++++++++++
:::.:::::.:::.........:::::;;;+++xxxx+++;;;::::..:...:.............                  ::;++++++++++;;;:::::::;;;;;;;;:::::::::::::..     ..::::::::::::::::::::::::::::::::::::::::::::;:;:;:;:;;;;++++x++
..............::::::;;;+++xxx+++;;::::::::.................... .                      :++++++++++++;;;::...:::::::::::;;;;;;;;:::::.   .::::::::::::::::::::::::::::::::::::::::::::::::::::;:;;:;:;;;;;;
.    ..:::::::;;+++xx+++;;;:::::::.:............ .....                                 :+++++++++++;;;;:::.......:::::::;;;;;;;;;::::..:+Xxxxx++++;;;;;::::::::::::::::::::::::::::::::::::::::::;:::;:;;
......:::;++++++;;;::::.:..:................ .                                        .:;++++++++++++;;;;:::..     ...::::;;;;;;:::.. :;+xXXXXXXXXXXXXXxxx++++;;;;:::::::::::::::::::::::::::::::::::::::
...::.::::::::.:................... . .                          ..::;;;.             ;++x+++++++++++++++;;;;;::...      ....:::...      :::;;;;;;++++xxXXXXXXXXXXXXXxx++++;;;;;::::::::::::::::::::::::::::
............................. .                        ...::;;;++xxxXXxx;:          ;;;+x+++++++++++++;;;;;:::..                      :+xxxx++++++;;;;;;;;++++xxXXXXXXXXXXXXxx+++;;;;;;;;;:;:::::::::::::
        ......... . .                         ....::;;++xxXXXXXxx+++;;;;::          ;+++xxx++++++++++++++;;;;::.                      :;++++xxxXXXXXXXxx++++;;;;;;;;+++xxXXXXXXXXXXXXXxxx++++;;;;;;:;::::
.                                   . ...::;;+++xxxXXXxx+++;;;;:::::;;;;+++         :++x++++++++++++++++++++;;::.                   .;+++;;;;;:;;;;;+++xxxXXXXXXXxx++++;;;;;;++++xXXXXXXXXXXXXXxx++++;;;;
..                          . ..:::;;++xxXXXxxxx++;;;;::::::;;;+++xxxx+++;;.       .;++x+++++++++++++++++++;;;;:.               ..:::;;;;++++xx+++++;;;;::;;;;+++xxxXXXXXXxx+++;;;;;;;+++xXXXXXXXXXXXXXXx
..                     ..::;;++xXXXXXxx+++;;;:::::::;;++++xxx+++;;;;::::::;;;      ;++x+++++++++++++++++++;;;;:.         :;+xxxxx++++;;;;;;::::;;;;++++xxx++++;;;;;;;;;;+++xxXXXXXXxx+++;;;;;;+++xxXXXXXX
 .                .:;++xxXXXXXxx++;;;:::::;;;+++xxx+++++;;:::::::;;;++++++;;;:.   ;+xx++++++++++++++++++;;;:::.      ...::;;;;;+++++xx+xxxxxxx++++;;;;;:;;;;;++++xxxx+++;;;;;;;;;+++xxxXXXXXxx+++;;;;;+++
..           ..::::+xXxx++;;;::::::;;+++xxx+++;;;::..::::;;;++++;;;;;:::::::;+XXXXXXXXxx+++++++++++++++++;::.       . .:    ......:::::;;;++++xxxxxXXxxx++++;;;;;;;;;;++++xxxx++++;;;;;;;++++xxXXXXXxx+++
       .. .::::::::::::::::;;;+++xx+++;;;:::::::;;;;;++;;;;:::::::::;;;+++++xXXX$$X$$$$XXXxx+++++++++++++;;;:.    . ....                ....:::::;;;;+++xxxxxXXXxxx+++;;;;;;;;;;++++xxxx+++;;;;;;;+++xxXX
  .................::::++x++++;;::::::::;;+++++;;;::.::::::;;;++++++++++;;;;XXXX$X$$$$$$$$X$XXx+++++++++++;;;:.. . . ...                           ....::::;;;;++++xxxXXXXxx+++;;;;;;;;;;+++xxxxx+++;;;;;
.......... ...::::::::::::::::::;;;+++;;;;:::::::::;;;++++++++;;;;;;;;++;::xXX$X$$$$$$$$$$$X$$XXXx++++++++;;::. .. .  ..:....                                ....::::;;;++++xxxxXXXxxx+++;;;;;;;;+++xxxxx
............:::.........::;++++;;;:::::::::;;++++++++;;;:::::::;;+++x++xx;+XXX$$$$$$X$$X$$$$X$$$XXXx++++;;::....... . . ..::;::::::::::.....                          ...::::::;;++++xxxXXXXxxx+++;;;;;;;
...........    ....:::::::::::::::;;;+++++++++++++;::::;:;;+xx++xxXXXXXXXXXXXXX$X$$$$$$$$$$$$$X$$XXXx+++;;:.....:....   .::;+;::;:::::::::::::::::...                          ..:::::;;;++++xxxxXXXxxx++
...       . ............::::;;+++++++++++;+;;;++++++++xxXXXXXXXXXXXXXXXXXXXXXXX$$X$$$$$$$X$$$$$$XX+    :;;:::.:::::::;+x+++;+;;:::::::.:.      ..:::....::::....                      ...:::::;;;++++xxxx
    ........ .......::::::::;;;;:;;;;+++xxxxXXXXxxxxxxx+xXXXXXXXXXXXXXXXXXXXXXXXX$$$X$$X$$$$X$$Xx        :.      :+XXXx++++;;+;::. .:::;;::...     :::....:::::.::::::::...                    ..:::::;;;
............. .::::::::.:......:;;+++xxXXXXXXXXXXXXXxxxx++xxXXXXXXXXXXXXXXXXXXXXXXXX$$$$$$$$$$X:                    .++++;;;;;+:.  :;;;;;;;;;;;.     ::....:::::.::::::::::::::....                    ..
.................... .     .:;;++xxxXXXXXXXXXXXXXxxxx+++++++++xxxxxXxxxxxxxXXXXXXXXXX$$$$$X$X+                        ;+;;;;;;;;  :;;;;;:;;;;;;::...        ..::::...::......::::::::::::...
.......... .               :;+xxxXXXXXXXXXx+++;;:                 .::::;::::;++++xXX$$$X$$$x:   ...                    ;++;;;;;;;:;+;:.    ::;;::::..         .::::. .......:......:::::::::::::::..
.                        :;++xxXXXXXxxx+:                                         .              :;+xXX+                ;++++;;;+;::        .:::;:;:..            ...  ....:.. ..:::::::::..    ..:::::::
                        ;++xxXXXXXxx+:                                                                 .:.               ;++++;:              :::;;;:.                  .  ..::::......              .:;:
                       ;;++xxxxXxx+:                                                      ::::..                                               ::;;;:....         .        .....::..                   .:
                     .;++xxxxxx+;                                                   :::::.                                                     ;++: .     ..:...   .:             .              .. .   .
                     :;+++xxx+:                                                     .XXXXXXXx+:.         .     :::                            :+++;:        :::..        ...                      ..:...
                   .;++xx++;                                                         ;XXXXXXXXXXXXX+;:.  .                        ::;++++                  .:::.... .       .                       :::..
                   :;++xx+:                                                           xXXXXXXXXXXXXXXXXX+;:                                                 :;:: ........ .                    .  ..:;;:.
                   :+xx;                                                              .XXXXXXXXXXXXXXXXXXXX+:                                                     ..  . ..                  .. ....::;;:.
                 .;+xx.                                                                ;XXXXXXXXXXXXXXXXXXx++:              ;;                                          .                         ..
                 :+++                                                                   +XXXXXXXXXXXXXXXXXx+x+              :xx+                                      ...                 ...    .
                :++;                                                                     xXXXXXXXXXXXXXXXX++++:              ;XX;                                                     .....     . .. ..
                :+:                                                                      ;XXXXXXXXXXXXXXXX+;++;               +Xx:                                                    .:...         .   .
               :;.                                                                       :XXXXXXXXXXXXXXXx++XX+.              :XX+.                                                  ::::.   .       .
                                                                                          +XXXXXXXXXXXXXXxxXXXx:               +Xx;                                                 .:::              ..
                                                                                          ;XXXXXXXXXXXXXXxxXXXx:               :xXx;                                          ..    .:;:              ..
.                                                                                         :XXXXXXXXXXXXXXXXXXXx:                +XX+:                                          .     ::.              .:.
        .:::.                                                                              +XXXXXXXXXXXXXXXXXXX;                :XXX+                                               .::.               :.
    ... ..:.                                                                               +XXXXXXXXXXXXXXXXXXX+                .+XXx;                                               ::.               ::
  ..::...::                                                                                +XXXXXXXXXXXXXXXXXXX+.                +XXXx.                                              :.                ::
  .:::..::                                                                                 ;XXXXXXXXXXXXXXXxxXX+.                :XXXx;                                              ..                ::
...:::.::.                                                                                 ;XXXXXXXXXXXXxx++xXXx:                 xXXX+:                                             ..                .:
..::. .:.                                                                                  ;XXXXXXXXXXXxx++xXXXX:                 +XXXx+                                             ..                .:
:;:..                                                                                      ;XXXXXXXXXxx+++xXXXXx:                 :XXXXx:                                            ..                .:
   ....                                                                                    ;XXXXXXXXxx+++xXXXXX+.                  +XXXx+                                             .                 :
    ..                                                                                     ;XXXXXXXxx++++XXXXXX;.                  ;XXXxx;                                                              :
   .                                                                                       ;XXXXXXXxx+++xXXXXXx;.                  .xXXxx+                                                              .
.                                                                                          +XXXXXXxx+++xXXX$XX+;:                   ;XXxxx:                                                             .`;

const ASCII_NAME = `   __                                      __
  / /_________  __  ___________  ____     / /_________  ____
 / __/ ___/ _ \\/ / / / ___/ __ \\/ __ \\   / __/ ___/ _ \\/ __ \\
/ /_/ /  /  __/ /_/ (__  ) /_/ / / / /  / /_(__  )  __/ / / /
\\__/_/   \\___/\\__, /____/\\____/_/ /_/   \\__/____/\\___/_/ /_/
             /____/`;

const socials = [
  { label: "github", href: "https://github.com/p0nyo", symbol: "[gh]" },
  { label: "instagram", href: "https://www.instagram.com/tsennpai/", symbol: "[ig]" },
  { label: "linkedin", href: "https://www.linkedin.com/in/tsen", symbol: "[li]" },
];

export default function Home() {
  return (
    <main
      className="flex flex-col md:flex-row items-center md:items-center justify-center min-h-screen gap-8 md:gap-12 p-8"
      style={{
        fontFamily: "'Menlo', 'Monaco', 'Courier New', Courier, monospace",
        background: "#0a0a0a",
        color: "#e8e8e0",
      }}
    >
      {/* Top on mobile, left on desktop — ASCII portrait */}
      <div className="portrait-wrap" style={{ flex: "0 0 auto", overflow: "auto" }}>
        <pre
          style={{
            fontSize: "clamp(1.5px, 0.5vw, 3px)",
            lineHeight: "1.15",
            letterSpacing: "0px",
            margin: 0,
            color: "#d4d4cc",
            whiteSpace: "pre",
            userSelect: "none",
          }}
        >
          {ASCII_PORTRAIT}
        </pre>
      </div>

      {/* Bottom on mobile, right on desktop — info */}
      <div
        className="w-full md:w-auto"
        style={{
          flex: "1 1 0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "2rem",
          maxWidth: "560px",
        }}
      >
        {/* Name in ASCII */}
        <pre
          style={{
            fontSize: "clamp(5px, 1.8vw, 11px)",
            lineHeight: "1.3",
            margin: 0,
            color: "#e8e8e0",
            whiteSpace: "pre",
            overflowX: "auto",
          }}
        >
          {ASCII_NAME}
        </pre>

        {/* Bio */}
        <section style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ fontSize: "clamp(8px, 2vw, 13px)", lineHeight: "1.7", margin: 0, color: "#c8c8c0" }}>
            {'>'} swe @ visa based in auckland, nz. previously a computer science major from university of auckland while working the grills at mcdonalds. i spend most of my time building things, ideally those that make me rich. obsessed with productivity, systems and tracking everything that i can. i enjoy snowboarding and playing tetris too #jirahater
          </p>
        </section>

        {/* Currently working on */}
        <section style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ fontSize: "clamp(8px, 2vw, 13px)", lineHeight: "1.7", margin: 0, color: "#c8c8c0" }}>
            {'>'} currently a tech lead for a university esports club and building out a website for a photography brand<span className="cursor" />
          </p>
        </section>

        {/* Social links */}
        <section style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                {s.symbol} {s.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
