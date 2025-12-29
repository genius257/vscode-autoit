#cs
# AutoIt vscode file for providing AutoIt3 built-in function intellisense.
#ce

#cs
# The command line options passed to AutoIt.
#
# @var Array
#ce
Global $CmdLine[]

#cs
# The raw command line passed to AutoIt.
#
# @var String
#ce
Global $CmdLineRaw = ""

#cs
# Calculates the absolute value of a number.
#
# A string has a value of zero.
#
# @param Mixed $expression Any valid numeric expression.
#
# @return Double Returns absolute value of expression.
#
# @see https://www.autoitscript.com/autoit3/docs/functions/Abs.htm
#ce
Func Abs($expression)
    #native code
EndFunc

#cs
# Calculates the arcCosine of a number.
#
# ACos(x) is mathematically defined only for -1 < x < 1, so ACos() tends to return -1.#IND for other values of x.
#
# @param Mixed $expression Any value between -1 and 1 inclusive.
#
# @return Double Returns the trigonometric arccosine of the number. Result is in radians.
#
# @see https://www.autoitscript.com/autoit3/docs/functions/ACos.htm
#ce
Func ACos($expression)
    #native code
EndFunc

#cs
# Registers an Adlib function.
#
# Every 250 ms (or time ms) the specified "function" is called - note that the first call to the function is after the specified time period and not immediately the function is registered.
# Typically the function is used to check for unforeseen errors. For example, you could use adlib in a script which causes an error window to pop up unpredictably.
# The adlib function should be kept simple as it is executed often and during this time the main script is paused. Also, the time parameter should be used carefully to avoid CPU load.
# You can not register a function using parameters.
#
# @param UserFunction|String<UserFunction> $function The adlib function to be registered.
# @param Int $time How often in milliseconds to call the function.
#
# @return 0|1
#
# @see https://www.autoitscript.com/autoit3/docs/functions/AdlibRegister.htm
#ce
Func AdlibRegister($function, $time = 250)
    #native code
EndFunc

#cs
# Unregisters an adlib function.
#
# If the function name is not specified then the last registered function will be unregistered.
#
# @param UserFunction|String<UserFunction> $function The name of the adlib function to be Unregistered.
#
# @return Int32 The number of adlib functions currently registered.
#ce
Func AdlibUnRegister($function = null)
    #native code
EndFunc

#cs
# Returns the ASCII code of a character.
#
# @param String $char The character to get the code for. If a string is used, the code for the first character is given.
#
# @return Int32 The ASCII code of the specified char.
#ce
Func Asc($char)
    #native code
EndFunc

#cs
# Returns the unicode code of a character.
#
# @param String $char The character to get the code for. If a string is used, the code for the first character is given.
#
# @return Int32 The unicode code of the specified char.
#ce
Func AscW($char)
    #native code
EndFunc

#cs
# Calculates the arcsine of a number.
#
# ASin(x) is mathematically defined only for -1 < x < 1, so ASin() tends to return -1.#IND for other values of x.
#
# @param Mixed $expression Any value between -1 and 1 (inclusive).
#
# @return Double Returns the trigonometric arcsine of the number. Result is in radians.
#ce
Func ASin($expression)
    #native code
EndFunc

#cs
# Assigns a variable by name with the data.
#
# If there is a need to use Assign() to create/write to a variable, then in most situations, Eval() should be used to read the variable and IsDeclared() should be used to check that the variable exists.
#
# @param String<Variable> $varname The name of the variable you wish to assign. Cannot be an array element and must only contain letters, digits and underscore characters (as per normal variable naming conventions).
# @param Mixed $data The data you wish to assign to the variable.
# @param Int $flags controls the way that variables are assigned.
#
# @return 0|1
#ce
Func Assign($varname, $data, $flag = 0)
    #native code
EndFunc

#cs
# Calculates the arctangent of a number.
#
# @param Mixed $expression Any valid numeric expression.
#
# @return Double The trigonometric arctangent of the number. Result is in radians.
#
# @see https://www.autoitscript.com/autoit3/docs/functions/ATan.htm
#ce
Func ATan($expression)
    #native code
EndFunc

#cs
# Changes the operation of various AutoIt functions/parameters.
#
# You may use Opt() as an alternative to AutoItSetOption().
#
# @option String $option The option to change.
# @param Mixed $param The value to assign to the option.
# The type and meaning vary by option.
# If the param is not provided, then the function just returns the value already assigned to the option.
# The keyword Default can be used for the parameter to reset the option to its default value.
#
# @return Mixed The value of the previous setting for the option.
#ce
Func AutoItSetOption($option, $param = Default)
    #native code
EndFunc

#cs
# Changes the operation of various AutoIt functions/parameters.
#
# @option String $option The option to change.
# @param Mixed $param The value to assign to the option.
# The type and meaning vary by option.
# If the param is not provided, then the function just returns the value already assigned to the option.
# The keyword Default can be used for the parameter to reset the option to its default value.
#
# @return Mixed The value of the previous setting for the option.
#ce
Func Opt($option, $param = Default)
    #native code
EndFunc

#cs
# Retrieves the title of the AutoIt window.
#
# @return String The title of the AutoIt window.
#ce
Func AutoItWinGetTitle()
    #native code
EndFunc

#cs
# Changes the title of the AutoIt window.
#
# The AutoIt window is usually hidden. The purpose of changing the title is to allow other programs (or other AutoIt scripts) to interact with AutoIt.
#
# @param String $newtitle The new title to give to the window.
#
# @return Void
#ce
Func AutoItWinSetTitle($newtitle)
    #native code
EndFunc

#cs
# Plays back a beep to the user.
#
# @param Int $frequency The frequency of the beep in hertz. Can be anywhere from 37 through 32,767 (0x25 through 0x7FFF).
# @param Int $duration The length of the beep in milliseconds.
#
# @returns 1 Always returns 1 regardless of success.
#ce
Func Beep($frequency = 500, $duration = 1000)
    #native code
EndFunc

#cs
# Returns the binary representation of an expression.
#
# See language datatypes for a detailed description.
#
# @return Binary
#
# @see https://www.autoitscript.com/autoit3/docs/intro/lang_datatypes.htm language datatypes
#ce
Func Binary($expression)
    #native code
EndFunc

#cs
# Returns the number of bytes in a binary variant.
#
# @param Binary $binary The data to evaluate.
#
# @return Int Returns the length of the data in bytes.
#ce
Func BinaryLen($binary)
    #native code
EndFunc

#cs
# Extracts a number of bytes from a binary variant.
#
# If start is out-of-bounds, an empty binary variant is returned.
# If start is valid but count is out-of-bounds, the entire remainder of the binary data is returned.
#
# @param Binary $binary The data to evaluate.
# @param Int $start The byte position to start. (1 = first byte)
# @param Int $count The number of bytes to extract. By default the entire remainder of the binary data.
#
# @return Binary The extracted binary data.
#ce
Func BinaryMid($binary, $start, $count = -1)
    #native code
EndFunc

#cs
# Converts a binary variant into a string.
#
# Unlike String() which returns a hexadecimal representation of binary data, this function will assume the binary data is a string value and convert it appropriately.
# See "Unicode Support" for a detailed description.
#
# @param Binary $expression An expression to convert into a string.
# @param Int $flags Changes how the binary data is converted:
# $SB_ANSI (1) = binary data is ANSI (default)
# $SB_UTF16LE (2) = binary data is UTF16 Little Endian
# $SB_UTF16BE (3) = binary data is UTF16 Big Endian
# $SB_UTF8 (4) = binary data is UTF8
# Constants are defined in StringConstants.au3
#
# @return String the string representation of the binary data or an empty string if an error occurs.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/unicode.htm Unicode Support
#ce
Func BinaryToString($expression, $flags = 1)
    #native code
EndFunc

#cs
# Performs a bitwise AND operation.
#
# Bit operations are performed as 32-bit integers.
#
# @param Int $value1
# @param Int $value2
# @param Int $value3
# @param Int $value4
# @param Int $value5
# @param Int $value6
# @param Int $value7
# @param Int $value8
# @param Int $value9
# @param Int $value10
# @param Int $value11
# @param Int $value12
# @param Int $value13
# @param Int $value14
# @param Int $value15
# @param Int $value16
# @param Int $value17
# @param Int $value18
# @param Int $value19
# @param Int $value20
# @param Int $value21
# @param Int $value22
# @param Int $value23
# @param Int $value24
# @param Int $value25
# @param Int $value26
# @param Int $value27
# @param Int $value28
# @param Int $value29
# @param Int $value30
# @param Int $value31
# @param Int $value32
# @param Int $value33
# @param Int $value34
# @param Int $value35
# @param Int $value36
# @param Int $value37
# @param Int $value38
# @param Int $value39
# @param Int $value40
# @param Int $value41
# @param Int $value42
# @param Int $value43
# @param Int $value44
# @param Int $value45
# @param Int $value46
# @param Int $value47
# @param Int $value48
# @param Int $value49
# @param Int $value50
# @param Int $value51
# @param Int $value52
# @param Int $value53
# @param Int $value54
# @param Int $value55
# @param Int $value56
# @param Int $value57
# @param Int $value58
# @param Int $value59
# @param Int $value60
# @param Int $value61
# @param Int $value62
# @param Int $value63
# @param Int $value64
# @param Int $value65
# @param Int $value66
# @param Int $value67
# @param Int $value68
# @param Int $value69
# @param Int $value70
# @param Int $value71
# @param Int $value72
# @param Int $value73
# @param Int $value74
# @param Int $value75
# @param Int $value76
# @param Int $value77
# @param Int $value78
# @param Int $value79
# @param Int $value80
# @param Int $value81
# @param Int $value82
# @param Int $value83
# @param Int $value84
# @param Int $value85
# @param Int $value86
# @param Int $value87
# @param Int $value88
# @param Int $value89
# @param Int $value90
# @param Int $value91
# @param Int $value92
# @param Int $value93
# @param Int $value94
# @param Int $value95
# @param Int $value96
# @param Int $value97
# @param Int $value98
# @param Int $value99
# @param Int $value100
# @param Int $value101
# @param Int $value102
# @param Int $value103
# @param Int $value104
# @param Int $value105
# @param Int $value106
# @param Int $value107
# @param Int $value108
# @param Int $value109
# @param Int $value110
# @param Int $value111
# @param Int $value112
# @param Int $value113
# @param Int $value114
# @param Int $value115
# @param Int $value116
# @param Int $value117
# @param Int $value118
# @param Int $value119
# @param Int $value120
# @param Int $value121
# @param Int $value122
# @param Int $value123
# @param Int $value124
# @param Int $value125
# @param Int $value126
# @param Int $value127
# @param Int $value128
# @param Int $value129
# @param Int $value130
# @param Int $value131
# @param Int $value132
# @param Int $value133
# @param Int $value134
# @param Int $value135
# @param Int $value136
# @param Int $value137
# @param Int $value138
# @param Int $value139
# @param Int $value140
# @param Int $value141
# @param Int $value142
# @param Int $value143
# @param Int $value144
# @param Int $value145
# @param Int $value146
# @param Int $value147
# @param Int $value148
# @param Int $value149
# @param Int $value150
# @param Int $value151
# @param Int $value152
# @param Int $value153
# @param Int $value154
# @param Int $value155
# @param Int $value156
# @param Int $value157
# @param Int $value158
# @param Int $value159
# @param Int $value160
# @param Int $value161
# @param Int $value162
# @param Int $value163
# @param Int $value164
# @param Int $value165
# @param Int $value166
# @param Int $value167
# @param Int $value168
# @param Int $value169
# @param Int $value170
# @param Int $value171
# @param Int $value172
# @param Int $value173
# @param Int $value174
# @param Int $value175
# @param Int $value176
# @param Int $value177
# @param Int $value178
# @param Int $value179
# @param Int $value180
# @param Int $value181
# @param Int $value182
# @param Int $value183
# @param Int $value184
# @param Int $value185
# @param Int $value186
# @param Int $value187
# @param Int $value188
# @param Int $value189
# @param Int $value190
# @param Int $value191
# @param Int $value192
# @param Int $value193
# @param Int $value194
# @param Int $value195
# @param Int $value196
# @param Int $value197
# @param Int $value198
# @param Int $value199
# @param Int $value200
# @param Int $value201
# @param Int $value202
# @param Int $value203
# @param Int $value204
# @param Int $value205
# @param Int $value206
# @param Int $value207
# @param Int $value208
# @param Int $value209
# @param Int $value210
# @param Int $value211
# @param Int $value212
# @param Int $value213
# @param Int $value214
# @param Int $value215
# @param Int $value216
# @param Int $value217
# @param Int $value218
# @param Int $value219
# @param Int $value220
# @param Int $value221
# @param Int $value222
# @param Int $value223
# @param Int $value224
# @param Int $value225
# @param Int $value226
# @param Int $value227
# @param Int $value228
# @param Int $value229
# @param Int $value230
# @param Int $value231
# @param Int $value232
# @param Int $value233
# @param Int $value234
# @param Int $value235
# @param Int $value236
# @param Int $value237
# @param Int $value238
# @param Int $value239
# @param Int $value240
# @param Int $value241
# @param Int $value242
# @param Int $value243
# @param Int $value244
# @param Int $value245
# @param Int $value246
# @param Int $value247
# @param Int $value248
# @param Int $value249
# @param Int $value250
# @param Int $value251
# @param Int $value252
# @param Int $value253
# @param Int $value254
# @param Int $value255
#
# @return Int32 The value of the parameters bitwise-AND'ed together.
#ce
Func BitAND($value1, $value2, $value3 = Default, $value4 = Default, $value5 = Default, $value6 = Default, $value7 = Default, $value8 = Default, $value9 = Default, $value10 = Default, $value11 = Default, $value12 = Default, $value13 = Default, $value14 = Default, $value15 = Default, $value16 = Default, $value17 = Default, $value18 = Default, $value19 = Default, $value20 = Default, $value21 = Default, $value22 = Default, $value23 = Default, $value24 = Default, $value25 = Default, $value26 = Default, $value27 = Default, $value28 = Default, $value29 = Default, $value30 = Default, $value31 = Default, $value32 = Default, $value33 = Default, $value34 = Default, $value35 = Default, $value36 = Default, $value37 = Default, $value38 = Default, $value39 = Default, $value40 = Default, $value41 = Default, $value42 = Default, $value43 = Default, $value44 = Default, $value45 = Default, $value46 = Default, $value47 = Default, $value48 = Default, $value49 = Default, $value50 = Default, $value51 = Default, $value52 = Default, $value53 = Default, $value54 = Default, $value55 = Default, $value56 = Default, $value57 = Default, $value58 = Default, $value59 = Default, $value60 = Default, $value61 = Default, $value62 = Default, $value63 = Default, $value64 = Default, $value65 = Default, $value66 = Default, $value67 = Default, $value68 = Default, $value69 = Default, $value70 = Default, $value71 = Default, $value72 = Default, $value73 = Default, $value74 = Default, $value75 = Default, $value76 = Default, $value77 = Default, $value78 = Default, $value79 = Default, $value80 = Default, $value81 = Default, $value82 = Default, $value83 = Default, $value84 = Default, $value85 = Default, $value86 = Default, $value87 = Default, $value88 = Default, $value89 = Default, $value90 = Default, $value91 = Default, $value92 = Default, $value93 = Default, $value94 = Default, $value95 = Default, $value96 = Default, $value97 = Default, $value98 = Default, $value99 = Default, $value100 = Default, $value101 = Default, $value102 = Default, $value103 = Default, $value104 = Default, $value105 = Default, $value106 = Default, $value107 = Default, $value108 = Default, $value109 = Default, $value110 = Default, $value111 = Default, $value112 = Default, $value113 = Default, $value114 = Default, $value115 = Default, $value116 = Default, $value117 = Default, $value118 = Default, $value119 = Default, $value120 = Default, $value121 = Default, $value122 = Default, $value123 = Default, $value124 = Default, $value125 = Default, $value126 = Default, $value127 = Default, $value128 = Default, $value129 = Default, $value130 = Default, $value131 = Default, $value132 = Default, $value133 = Default, $value134 = Default, $value135 = Default, $value136 = Default, $value137 = Default, $value138 = Default, $value139 = Default, $value140 = Default, $value141 = Default, $value142 = Default, $value143 = Default, $value144 = Default, $value145 = Default, $value146 = Default, $value147 = Default, $value148 = Default, $value149 = Default, $value150 = Default, $value151 = Default, $value152 = Default, $value153 = Default, $value154 = Default, $value155 = Default, $value156 = Default, $value157 = Default, $value158 = Default, $value159 = Default, $value160 = Default, $value161 = Default, $value162 = Default, $value163 = Default, $value164 = Default, $value165 = Default, $value166 = Default, $value167 = Default, $value168 = Default, $value169 = Default, $value170 = Default, $value171 = Default, $value172 = Default, $value173 = Default, $value174 = Default, $value175 = Default, $value176 = Default, $value177 = Default, $value178 = Default, $value179 = Default, $value180 = Default, $value181 = Default, $value182 = Default, $value183 = Default, $value184 = Default, $value185 = Default, $value186 = Default, $value187 = Default, $value188 = Default, $value189 = Default, $value190 = Default, $value191 = Default, $value192 = Default, $value193 = Default, $value194 = Default, $value195 = Default, $value196 = Default, $value197 = Default, $value198 = Default, $value199 = Default, $value200 = Default, $value201 = Default, $value202 = Default, $value203 = Default, $value204 = Default, $value205 = Default, $value206 = Default, $value207 = Default, $value208 = Default, $value209 = Default, $value210 = Default, $value211 = Default, $value212 = Default, $value213 = Default, $value214 = Default, $value215 = Default, $value216 = Default, $value217 = Default, $value218 = Default, $value219 = Default, $value220 = Default, $value221 = Default, $value222 = Default, $value223 = Default, $value224 = Default, $value225 = Default, $value226 = Default, $value227 = Default, $value228 = Default, $value229 = Default, $value230 = Default, $value231 = Default, $value232 = Default, $value233 = Default, $value234 = Default, $value235 = Default, $value236 = Default, $value237 = Default, $value238 = Default, $value239 = Default, $value240 = Default, $value241 = Default, $value242 = Default, $value243 = Default, $value244 = Default, $value245 = Default, $value246 = Default, $value247 = Default, $value248 = Default, $value249 = Default, $value250 = Default, $value251 = Default, $value252 = Default, $value253 = Default, $value254 = Default, $value255 = Default)
    #native code
EndFunc

#cs
# Performs a bitwise NOT operation.
#
# Bit operations are performed as 32-bit integers.
#
# @param Int $value The number to operate on
#
# @return Int32 Returns the bitwise NOT of the value.
#ce
Func BitNOT($value)
    #native code
EndFunc

#cs
# Performs a bitwise OR operation.
#
# Bit operations are performed as 32-bit integers.
#
# @param Int $value1
# @param Int $value2
# @param Int $value3
# @param Int $value4
# @param Int $value5
# @param Int $value6
# @param Int $value7
# @param Int $value8
# @param Int $value9
# @param Int $value10
# @param Int $value11
# @param Int $value12
# @param Int $value13
# @param Int $value14
# @param Int $value15
# @param Int $value16
# @param Int $value17
# @param Int $value18
# @param Int $value19
# @param Int $value20
# @param Int $value21
# @param Int $value22
# @param Int $value23
# @param Int $value24
# @param Int $value25
# @param Int $value26
# @param Int $value27
# @param Int $value28
# @param Int $value29
# @param Int $value30
# @param Int $value31
# @param Int $value32
# @param Int $value33
# @param Int $value34
# @param Int $value35
# @param Int $value36
# @param Int $value37
# @param Int $value38
# @param Int $value39
# @param Int $value40
# @param Int $value41
# @param Int $value42
# @param Int $value43
# @param Int $value44
# @param Int $value45
# @param Int $value46
# @param Int $value47
# @param Int $value48
# @param Int $value49
# @param Int $value50
# @param Int $value51
# @param Int $value52
# @param Int $value53
# @param Int $value54
# @param Int $value55
# @param Int $value56
# @param Int $value57
# @param Int $value58
# @param Int $value59
# @param Int $value60
# @param Int $value61
# @param Int $value62
# @param Int $value63
# @param Int $value64
# @param Int $value65
# @param Int $value66
# @param Int $value67
# @param Int $value68
# @param Int $value69
# @param Int $value70
# @param Int $value71
# @param Int $value72
# @param Int $value73
# @param Int $value74
# @param Int $value75
# @param Int $value76
# @param Int $value77
# @param Int $value78
# @param Int $value79
# @param Int $value80
# @param Int $value81
# @param Int $value82
# @param Int $value83
# @param Int $value84
# @param Int $value85
# @param Int $value86
# @param Int $value87
# @param Int $value88
# @param Int $value89
# @param Int $value90
# @param Int $value91
# @param Int $value92
# @param Int $value93
# @param Int $value94
# @param Int $value95
# @param Int $value96
# @param Int $value97
# @param Int $value98
# @param Int $value99
# @param Int $value100
# @param Int $value101
# @param Int $value102
# @param Int $value103
# @param Int $value104
# @param Int $value105
# @param Int $value106
# @param Int $value107
# @param Int $value108
# @param Int $value109
# @param Int $value110
# @param Int $value111
# @param Int $value112
# @param Int $value113
# @param Int $value114
# @param Int $value115
# @param Int $value116
# @param Int $value117
# @param Int $value118
# @param Int $value119
# @param Int $value120
# @param Int $value121
# @param Int $value122
# @param Int $value123
# @param Int $value124
# @param Int $value125
# @param Int $value126
# @param Int $value127
# @param Int $value128
# @param Int $value129
# @param Int $value130
# @param Int $value131
# @param Int $value132
# @param Int $value133
# @param Int $value134
# @param Int $value135
# @param Int $value136
# @param Int $value137
# @param Int $value138
# @param Int $value139
# @param Int $value140
# @param Int $value141
# @param Int $value142
# @param Int $value143
# @param Int $value144
# @param Int $value145
# @param Int $value146
# @param Int $value147
# @param Int $value148
# @param Int $value149
# @param Int $value150
# @param Int $value151
# @param Int $value152
# @param Int $value153
# @param Int $value154
# @param Int $value155
# @param Int $value156
# @param Int $value157
# @param Int $value158
# @param Int $value159
# @param Int $value160
# @param Int $value161
# @param Int $value162
# @param Int $value163
# @param Int $value164
# @param Int $value165
# @param Int $value166
# @param Int $value167
# @param Int $value168
# @param Int $value169
# @param Int $value170
# @param Int $value171
# @param Int $value172
# @param Int $value173
# @param Int $value174
# @param Int $value175
# @param Int $value176
# @param Int $value177
# @param Int $value178
# @param Int $value179
# @param Int $value180
# @param Int $value181
# @param Int $value182
# @param Int $value183
# @param Int $value184
# @param Int $value185
# @param Int $value186
# @param Int $value187
# @param Int $value188
# @param Int $value189
# @param Int $value190
# @param Int $value191
# @param Int $value192
# @param Int $value193
# @param Int $value194
# @param Int $value195
# @param Int $value196
# @param Int $value197
# @param Int $value198
# @param Int $value199
# @param Int $value200
# @param Int $value201
# @param Int $value202
# @param Int $value203
# @param Int $value204
# @param Int $value205
# @param Int $value206
# @param Int $value207
# @param Int $value208
# @param Int $value209
# @param Int $value210
# @param Int $value211
# @param Int $value212
# @param Int $value213
# @param Int $value214
# @param Int $value215
# @param Int $value216
# @param Int $value217
# @param Int $value218
# @param Int $value219
# @param Int $value220
# @param Int $value221
# @param Int $value222
# @param Int $value223
# @param Int $value224
# @param Int $value225
# @param Int $value226
# @param Int $value227
# @param Int $value228
# @param Int $value229
# @param Int $value230
# @param Int $value231
# @param Int $value232
# @param Int $value233
# @param Int $value234
# @param Int $value235
# @param Int $value236
# @param Int $value237
# @param Int $value238
# @param Int $value239
# @param Int $value240
# @param Int $value241
# @param Int $value242
# @param Int $value243
# @param Int $value244
# @param Int $value245
# @param Int $value246
# @param Int $value247
# @param Int $value248
# @param Int $value249
# @param Int $value250
# @param Int $value251
# @param Int $value252
# @param Int $value253
# @param Int $value254
# @param Int $value255
#
# @return Int32 The two parameters bitwise-OR'ed together.
#ce
Func BitOR($value1, $value2, $value3 = Default, $value4 = Default, $value5 = Default, $value6 = Default, $value7 = Default, $value8 = Default, $value9 = Default, $value10 = Default, $value11 = Default, $value12 = Default, $value13 = Default, $value14 = Default, $value15 = Default, $value16 = Default, $value17 = Default, $value18 = Default, $value19 = Default, $value20 = Default, $value21 = Default, $value22 = Default, $value23 = Default, $value24 = Default, $value25 = Default, $value26 = Default, $value27 = Default, $value28 = Default, $value29 = Default, $value30 = Default, $value31 = Default, $value32 = Default, $value33 = Default, $value34 = Default, $value35 = Default, $value36 = Default, $value37 = Default, $value38 = Default, $value39 = Default, $value40 = Default, $value41 = Default, $value42 = Default, $value43 = Default, $value44 = Default, $value45 = Default, $value46 = Default, $value47 = Default, $value48 = Default, $value49 = Default, $value50 = Default, $value51 = Default, $value52 = Default, $value53 = Default, $value54 = Default, $value55 = Default, $value56 = Default, $value57 = Default, $value58 = Default, $value59 = Default, $value60 = Default, $value61 = Default, $value62 = Default, $value63 = Default, $value64 = Default, $value65 = Default, $value66 = Default, $value67 = Default, $value68 = Default, $value69 = Default, $value70 = Default, $value71 = Default, $value72 = Default, $value73 = Default, $value74 = Default, $value75 = Default, $value76 = Default, $value77 = Default, $value78 = Default, $value79 = Default, $value80 = Default, $value81 = Default, $value82 = Default, $value83 = Default, $value84 = Default, $value85 = Default, $value86 = Default, $value87 = Default, $value88 = Default, $value89 = Default, $value90 = Default, $value91 = Default, $value92 = Default, $value93 = Default, $value94 = Default, $value95 = Default, $value96 = Default, $value97 = Default, $value98 = Default, $value99 = Default, $value100 = Default, $value101 = Default, $value102 = Default, $value103 = Default, $value104 = Default, $value105 = Default, $value106 = Default, $value107 = Default, $value108 = Default, $value109 = Default, $value110 = Default, $value111 = Default, $value112 = Default, $value113 = Default, $value114 = Default, $value115 = Default, $value116 = Default, $value117 = Default, $value118 = Default, $value119 = Default, $value120 = Default, $value121 = Default, $value122 = Default, $value123 = Default, $value124 = Default, $value125 = Default, $value126 = Default, $value127 = Default, $value128 = Default, $value129 = Default, $value130 = Default, $value131 = Default, $value132 = Default, $value133 = Default, $value134 = Default, $value135 = Default, $value136 = Default, $value137 = Default, $value138 = Default, $value139 = Default, $value140 = Default, $value141 = Default, $value142 = Default, $value143 = Default, $value144 = Default, $value145 = Default, $value146 = Default, $value147 = Default, $value148 = Default, $value149 = Default, $value150 = Default, $value151 = Default, $value152 = Default, $value153 = Default, $value154 = Default, $value155 = Default, $value156 = Default, $value157 = Default, $value158 = Default, $value159 = Default, $value160 = Default, $value161 = Default, $value162 = Default, $value163 = Default, $value164 = Default, $value165 = Default, $value166 = Default, $value167 = Default, $value168 = Default, $value169 = Default, $value170 = Default, $value171 = Default, $value172 = Default, $value173 = Default, $value174 = Default, $value175 = Default, $value176 = Default, $value177 = Default, $value178 = Default, $value179 = Default, $value180 = Default, $value181 = Default, $value182 = Default, $value183 = Default, $value184 = Default, $value185 = Default, $value186 = Default, $value187 = Default, $value188 = Default, $value189 = Default, $value190 = Default, $value191 = Default, $value192 = Default, $value193 = Default, $value194 = Default, $value195 = Default, $value196 = Default, $value197 = Default, $value198 = Default, $value199 = Default, $value200 = Default, $value201 = Default, $value202 = Default, $value203 = Default, $value204 = Default, $value205 = Default, $value206 = Default, $value207 = Default, $value208 = Default, $value209 = Default, $value210 = Default, $value211 = Default, $value212 = Default, $value213 = Default, $value214 = Default, $value215 = Default, $value216 = Default, $value217 = Default, $value218 = Default, $value219 = Default, $value220 = Default, $value221 = Default, $value222 = Default, $value223 = Default, $value224 = Default, $value225 = Default, $value226 = Default, $value227 = Default, $value228 = Default, $value229 = Default, $value230 = Default, $value231 = Default, $value232 = Default, $value233 = Default, $value234 = Default, $value235 = Default, $value236 = Default, $value237 = Default, $value238 = Default, $value239 = Default, $value240 = Default, $value241 = Default, $value242 = Default, $value243 = Default, $value244 = Default, $value245 = Default, $value246 = Default, $value247 = Default, $value248 = Default, $value249 = Default, $value250 = Default, $value251 = Default, $value252 = Default, $value253 = Default, $value254 = Default, $value255 = Default)
    #native code
EndFunc

#cs
# Performs a bit shifting operation, with rotation.
#
# @param Int $value The number to operate on
# @param Int $shift Number of bits to rotate to the left (negative numbers rotate right).
# @param String $size A string that determines the rotation size, the default is (16 bits)
# "B": rotate bits within the low-order byte (8 bits).
# "W": rotate bits within the low-order word (16 bits).
# "D": rotate bits within the entire double-word (32 bits).
#
# @return Int32 The value rotated by the required number of bits.
#ce
Func BitRotate($value, $shift, $size = "W")
    #native code
EndFunc

#cs
# Performs a bit shifting operation.
#
# Bit operations are performed as 32-bit integers.
#
# @param Int $value The number to be shifted.
# @param Int $shift Number of bits to shift to the right (negative numbers shift left).
#
# @return Int32 The value shifted by the required number of bits.
#ce
Func BitShift($value, $shift)
    #native code
EndFunc

#cs
# Performs a bitwise exclusive OR (XOR) operation.
#
# Bit operations are performed as 32-bit integers.
#
# @param Int $value1
# @param Int $value2
# @param Int $value3
# @param Int $value4
# @param Int $value5
# @param Int $value6
# @param Int $value7
# @param Int $value8
# @param Int $value9
# @param Int $value10
# @param Int $value11
# @param Int $value12
# @param Int $value13
# @param Int $value14
# @param Int $value15
# @param Int $value16
# @param Int $value17
# @param Int $value18
# @param Int $value19
# @param Int $value20
# @param Int $value21
# @param Int $value22
# @param Int $value23
# @param Int $value24
# @param Int $value25
# @param Int $value26
# @param Int $value27
# @param Int $value28
# @param Int $value29
# @param Int $value30
# @param Int $value31
# @param Int $value32
# @param Int $value33
# @param Int $value34
# @param Int $value35
# @param Int $value36
# @param Int $value37
# @param Int $value38
# @param Int $value39
# @param Int $value40
# @param Int $value41
# @param Int $value42
# @param Int $value43
# @param Int $value44
# @param Int $value45
# @param Int $value46
# @param Int $value47
# @param Int $value48
# @param Int $value49
# @param Int $value50
# @param Int $value51
# @param Int $value52
# @param Int $value53
# @param Int $value54
# @param Int $value55
# @param Int $value56
# @param Int $value57
# @param Int $value58
# @param Int $value59
# @param Int $value60
# @param Int $value61
# @param Int $value62
# @param Int $value63
# @param Int $value64
# @param Int $value65
# @param Int $value66
# @param Int $value67
# @param Int $value68
# @param Int $value69
# @param Int $value70
# @param Int $value71
# @param Int $value72
# @param Int $value73
# @param Int $value74
# @param Int $value75
# @param Int $value76
# @param Int $value77
# @param Int $value78
# @param Int $value79
# @param Int $value80
# @param Int $value81
# @param Int $value82
# @param Int $value83
# @param Int $value84
# @param Int $value85
# @param Int $value86
# @param Int $value87
# @param Int $value88
# @param Int $value89
# @param Int $value90
# @param Int $value91
# @param Int $value92
# @param Int $value93
# @param Int $value94
# @param Int $value95
# @param Int $value96
# @param Int $value97
# @param Int $value98
# @param Int $value99
# @param Int $value100
# @param Int $value101
# @param Int $value102
# @param Int $value103
# @param Int $value104
# @param Int $value105
# @param Int $value106
# @param Int $value107
# @param Int $value108
# @param Int $value109
# @param Int $value110
# @param Int $value111
# @param Int $value112
# @param Int $value113
# @param Int $value114
# @param Int $value115
# @param Int $value116
# @param Int $value117
# @param Int $value118
# @param Int $value119
# @param Int $value120
# @param Int $value121
# @param Int $value122
# @param Int $value123
# @param Int $value124
# @param Int $value125
# @param Int $value126
# @param Int $value127
# @param Int $value128
# @param Int $value129
# @param Int $value130
# @param Int $value131
# @param Int $value132
# @param Int $value133
# @param Int $value134
# @param Int $value135
# @param Int $value136
# @param Int $value137
# @param Int $value138
# @param Int $value139
# @param Int $value140
# @param Int $value141
# @param Int $value142
# @param Int $value143
# @param Int $value144
# @param Int $value145
# @param Int $value146
# @param Int $value147
# @param Int $value148
# @param Int $value149
# @param Int $value150
# @param Int $value151
# @param Int $value152
# @param Int $value153
# @param Int $value154
# @param Int $value155
# @param Int $value156
# @param Int $value157
# @param Int $value158
# @param Int $value159
# @param Int $value160
# @param Int $value161
# @param Int $value162
# @param Int $value163
# @param Int $value164
# @param Int $value165
# @param Int $value166
# @param Int $value167
# @param Int $value168
# @param Int $value169
# @param Int $value170
# @param Int $value171
# @param Int $value172
# @param Int $value173
# @param Int $value174
# @param Int $value175
# @param Int $value176
# @param Int $value177
# @param Int $value178
# @param Int $value179
# @param Int $value180
# @param Int $value181
# @param Int $value182
# @param Int $value183
# @param Int $value184
# @param Int $value185
# @param Int $value186
# @param Int $value187
# @param Int $value188
# @param Int $value189
# @param Int $value190
# @param Int $value191
# @param Int $value192
# @param Int $value193
# @param Int $value194
# @param Int $value195
# @param Int $value196
# @param Int $value197
# @param Int $value198
# @param Int $value199
# @param Int $value200
# @param Int $value201
# @param Int $value202
# @param Int $value203
# @param Int $value204
# @param Int $value205
# @param Int $value206
# @param Int $value207
# @param Int $value208
# @param Int $value209
# @param Int $value210
# @param Int $value211
# @param Int $value212
# @param Int $value213
# @param Int $value214
# @param Int $value215
# @param Int $value216
# @param Int $value217
# @param Int $value218
# @param Int $value219
# @param Int $value220
# @param Int $value221
# @param Int $value222
# @param Int $value223
# @param Int $value224
# @param Int $value225
# @param Int $value226
# @param Int $value227
# @param Int $value228
# @param Int $value229
# @param Int $value230
# @param Int $value231
# @param Int $value232
# @param Int $value233
# @param Int $value234
# @param Int $value235
# @param Int $value236
# @param Int $value237
# @param Int $value238
# @param Int $value239
# @param Int $value240
# @param Int $value241
# @param Int $value242
# @param Int $value243
# @param Int $value244
# @param Int $value245
# @param Int $value246
# @param Int $value247
# @param Int $value248
# @param Int $value249
# @param Int $value250
# @param Int $value251
# @param Int $value252
# @param Int $value253
# @param Int $value254
# @param Int $value255
#
# @return Int32 The value of the parameters bitwise-XOR'ed together.
#ce
Func BitXOR($value1, $value2, $value3 = Default, $value4 = Default, $value5 = Default, $value6 = Default, $value7 = Default, $value8 = Default, $value9 = Default, $value10 = Default, $value11 = Default, $value12 = Default, $value13 = Default, $value14 = Default, $value15 = Default, $value16 = Default, $value17 = Default, $value18 = Default, $value19 = Default, $value20 = Default, $value21 = Default, $value22 = Default, $value23 = Default, $value24 = Default, $value25 = Default, $value26 = Default, $value27 = Default, $value28 = Default, $value29 = Default, $value30 = Default, $value31 = Default, $value32 = Default, $value33 = Default, $value34 = Default, $value35 = Default, $value36 = Default, $value37 = Default, $value38 = Default, $value39 = Default, $value40 = Default, $value41 = Default, $value42 = Default, $value43 = Default, $value44 = Default, $value45 = Default, $value46 = Default, $value47 = Default, $value48 = Default, $value49 = Default, $value50 = Default, $value51 = Default, $value52 = Default, $value53 = Default, $value54 = Default, $value55 = Default, $value56 = Default, $value57 = Default, $value58 = Default, $value59 = Default, $value60 = Default, $value61 = Default, $value62 = Default, $value63 = Default, $value64 = Default, $value65 = Default, $value66 = Default, $value67 = Default, $value68 = Default, $value69 = Default, $value70 = Default, $value71 = Default, $value72 = Default, $value73 = Default, $value74 = Default, $value75 = Default, $value76 = Default, $value77 = Default, $value78 = Default, $value79 = Default, $value80 = Default, $value81 = Default, $value82 = Default, $value83 = Default, $value84 = Default, $value85 = Default, $value86 = Default, $value87 = Default, $value88 = Default, $value89 = Default, $value90 = Default, $value91 = Default, $value92 = Default, $value93 = Default, $value94 = Default, $value95 = Default, $value96 = Default, $value97 = Default, $value98 = Default, $value99 = Default, $value100 = Default, $value101 = Default, $value102 = Default, $value103 = Default, $value104 = Default, $value105 = Default, $value106 = Default, $value107 = Default, $value108 = Default, $value109 = Default, $value110 = Default, $value111 = Default, $value112 = Default, $value113 = Default, $value114 = Default, $value115 = Default, $value116 = Default, $value117 = Default, $value118 = Default, $value119 = Default, $value120 = Default, $value121 = Default, $value122 = Default, $value123 = Default, $value124 = Default, $value125 = Default, $value126 = Default, $value127 = Default, $value128 = Default, $value129 = Default, $value130 = Default, $value131 = Default, $value132 = Default, $value133 = Default, $value134 = Default, $value135 = Default, $value136 = Default, $value137 = Default, $value138 = Default, $value139 = Default, $value140 = Default, $value141 = Default, $value142 = Default, $value143 = Default, $value144 = Default, $value145 = Default, $value146 = Default, $value147 = Default, $value148 = Default, $value149 = Default, $value150 = Default, $value151 = Default, $value152 = Default, $value153 = Default, $value154 = Default, $value155 = Default, $value156 = Default, $value157 = Default, $value158 = Default, $value159 = Default, $value160 = Default, $value161 = Default, $value162 = Default, $value163 = Default, $value164 = Default, $value165 = Default, $value166 = Default, $value167 = Default, $value168 = Default, $value169 = Default, $value170 = Default, $value171 = Default, $value172 = Default, $value173 = Default, $value174 = Default, $value175 = Default, $value176 = Default, $value177 = Default, $value178 = Default, $value179 = Default, $value180 = Default, $value181 = Default, $value182 = Default, $value183 = Default, $value184 = Default, $value185 = Default, $value186 = Default, $value187 = Default, $value188 = Default, $value189 = Default, $value190 = Default, $value191 = Default, $value192 = Default, $value193 = Default, $value194 = Default, $value195 = Default, $value196 = Default, $value197 = Default, $value198 = Default, $value199 = Default, $value200 = Default, $value201 = Default, $value202 = Default, $value203 = Default, $value204 = Default, $value205 = Default, $value206 = Default, $value207 = Default, $value208 = Default, $value209 = Default, $value210 = Default, $value211 = Default, $value212 = Default, $value213 = Default, $value214 = Default, $value215 = Default, $value216 = Default, $value217 = Default, $value218 = Default, $value219 = Default, $value220 = Default, $value221 = Default, $value222 = Default, $value223 = Default, $value224 = Default, $value225 = Default, $value226 = Default, $value227 = Default, $value228 = Default, $value229 = Default, $value230 = Default, $value231 = Default, $value232 = Default, $value233 = Default, $value234 = Default, $value235 = Default, $value236 = Default, $value237 = Default, $value238 = Default, $value239 = Default, $value240 = Default, $value241 = Default, $value242 = Default, $value243 = Default, $value244 = Default, $value245 = Default, $value246 = Default, $value247 = Default, $value248 = Default, $value249 = Default, $value250 = Default, $value251 = Default, $value252 = Default, $value253 = Default, $value254 = Default, $value255 = Default)
    #native code
EndFunc

#cs
# Disable/enable the mouse and keyboard.
#
# The table below shows how BlockInput() behavior depends on the Windows version; however, pressing Ctrl+Alt+Del on any platform will re-enable input due to a Windows API feature.
#
# | Operating System | "BlockInput()" Results |
# | ----------------- | ---------------------- |
# | Windows XP        | User input is blocked and AutoIt can simulate mouse and keyboard input. |
# | Windows Vista and above | User input is blocked and AutoIt can simulate mouse and keyboard if #RequireAdmin is used. |
#
# BlockInput() only affects user-input. Input from functions like Send() or MouseMove() still work.
#
# @param 0|1 $flag
# $BI_DISABLE (1) = Disable user input
# $BI_ENABLE (0) = Enable user input
# Constants are defined in "AutoItConstants.au3".
#
# @return 0|1 Returns 1 if successful, or 0 if already enabled or #RequireAdmin not used.
#ce
Func BlockInput($flag)
    #native code
EndFunc

#cs
# Enables or disables the users' ability to exit a script from the tray icon menu.
#
# Please only disable break with good reason.
# AutoIt normally creates a tray icon when running, and right-clicking this icon allows the user to pause or exit the script.
# If Break() is disabled (0), then the user cannot terminate the script this way.
#
# @param 0|1 $mode Sets the script break mode:
# $BREAK_ENABLE (1) = Break is enabled (user can quit) (default)
# $BREAK_DISABLE (0) = Break is disabled (user cannot quit)
# Constants are defined in "AutoItConstants.au3".
#
# @return Void
#ce
Func Break($mode)
    #native code
EndFunc

#cs
# Calls a user-defined or built-in function contained in first parameter.
#
# Arguments can be passed to functions individually or by placing them in an array.
# This array, which must be the only parameter used, should have its [0] element set to "CallArgArray" while elements [1 - N] hold the separate arguments to the function.
# @param UserFunction|String<UserFunction> $function The name of function to call as a literal string.
#
# Note that either Call() or the called function can set the @error flag. If Call() sets the @error flag, the value will be 0xDEAD and @extended will also be set to 0xBEEF.
#
# @param UserFunction|String<UserFunction> $function
# @param Mixed $param_1
# @param Mixed $param_2
# @param Mixed $param_3
# @param Mixed $param_4
# @param Mixed $param_5
# @param Mixed $param_6
# @param Mixed $param_7
# @param Mixed $param_8
# @param Mixed $param_9
# @param Mixed $param_10
# @param Mixed $param_11
# @param Mixed $param_12
# @param Mixed $param_13
# @param Mixed $param_14
# @param Mixed $param_15
# @param Mixed $param_16
# @param Mixed $param_17
# @param Mixed $param_18
# @param Mixed $param_19
# @param Mixed $param_20
# @param Mixed $param_21
# @param Mixed $param_22
# @param Mixed $param_23
# @param Mixed $param_24
# @param Mixed $param_25
# @param Mixed $param_26
# @param Mixed $param_27
# @param Mixed $param_28
# @param Mixed $param_29
# @param Mixed $param_30
# @param Mixed $param_31
# @param Mixed $param_32
# @param Mixed $param_33
# @param Mixed $param_34
# @param Mixed $param_35
# @param Mixed $param_36
# @param Mixed $param_37
# @param Mixed $param_38
# @param Mixed $param_39
# @param Mixed $param_40
# @param Mixed $param_41
# @param Mixed $param_42
# @param Mixed $param_43
# @param Mixed $param_44
# @param Mixed $param_45
# @param Mixed $param_46
# @param Mixed $param_47
# @param Mixed $param_48
# @param Mixed $param_49
# @param Mixed $param_50
# @param Mixed $param_51
# @param Mixed $param_52
# @param Mixed $param_53
# @param Mixed $param_54
# @param Mixed $param_55
# @param Mixed $param_56
# @param Mixed $param_57
# @param Mixed $param_58
# @param Mixed $param_59
# @param Mixed $param_60
# @param Mixed $param_61
# @param Mixed $param_62
# @param Mixed $param_63
# @param Mixed $param_64
# @param Mixed $param_65
# @param Mixed $param_66
# @param Mixed $param_67
# @param Mixed $param_68
# @param Mixed $param_69
# @param Mixed $param_70
# @param Mixed $param_71
# @param Mixed $param_72
# @param Mixed $param_73
# @param Mixed $param_74
# @param Mixed $param_75
# @param Mixed $param_76
# @param Mixed $param_77
# @param Mixed $param_78
# @param Mixed $param_79
# @param Mixed $param_80
# @param Mixed $param_81
# @param Mixed $param_82
# @param Mixed $param_83
# @param Mixed $param_84
# @param Mixed $param_85
# @param Mixed $param_86
# @param Mixed $param_87
# @param Mixed $param_88
# @param Mixed $param_89
# @param Mixed $param_90
# @param Mixed $param_91
# @param Mixed $param_92
# @param Mixed $param_93
# @param Mixed $param_94
# @param Mixed $param_95
# @param Mixed $param_96
# @param Mixed $param_97
# @param Mixed $param_98
# @param Mixed $param_99
# @param Mixed $param_100
# @param Mixed $param_101
# @param Mixed $param_102
# @param Mixed $param_103
# @param Mixed $param_104
# @param Mixed $param_105
# @param Mixed $param_106
# @param Mixed $param_107
# @param Mixed $param_108
# @param Mixed $param_109
# @param Mixed $param_110
# @param Mixed $param_111
# @param Mixed $param_112
# @param Mixed $param_113
# @param Mixed $param_114
# @param Mixed $param_115
# @param Mixed $param_116
# @param Mixed $param_117
# @param Mixed $param_118
# @param Mixed $param_119
# @param Mixed $param_120
# @param Mixed $param_121
# @param Mixed $param_122
# @param Mixed $param_123
# @param Mixed $param_124
# @param Mixed $param_125
# @param Mixed $param_126
# @param Mixed $param_127
# @param Mixed $param_128
# @param Mixed $param_129
# @param Mixed $param_130
# @param Mixed $param_131
# @param Mixed $param_132
# @param Mixed $param_133
# @param Mixed $param_134
# @param Mixed $param_135
# @param Mixed $param_136
# @param Mixed $param_137
# @param Mixed $param_138
# @param Mixed $param_139
# @param Mixed $param_140
# @param Mixed $param_141
# @param Mixed $param_142
# @param Mixed $param_143
# @param Mixed $param_144
# @param Mixed $param_145
# @param Mixed $param_146
# @param Mixed $param_147
# @param Mixed $param_148
# @param Mixed $param_149
# @param Mixed $param_150
# @param Mixed $param_151
# @param Mixed $param_152
# @param Mixed $param_153
# @param Mixed $param_154
# @param Mixed $param_155
# @param Mixed $param_156
# @param Mixed $param_157
# @param Mixed $param_158
# @param Mixed $param_159
# @param Mixed $param_160
# @param Mixed $param_161
# @param Mixed $param_162
# @param Mixed $param_163
# @param Mixed $param_164
# @param Mixed $param_165
# @param Mixed $param_166
# @param Mixed $param_167
# @param Mixed $param_168
# @param Mixed $param_169
# @param Mixed $param_170
# @param Mixed $param_171
# @param Mixed $param_172
# @param Mixed $param_173
# @param Mixed $param_174
# @param Mixed $param_175
# @param Mixed $param_176
# @param Mixed $param_177
# @param Mixed $param_178
# @param Mixed $param_179
# @param Mixed $param_180
# @param Mixed $param_181
# @param Mixed $param_182
# @param Mixed $param_183
# @param Mixed $param_184
# @param Mixed $param_185
# @param Mixed $param_186
# @param Mixed $param_187
# @param Mixed $param_188
# @param Mixed $param_189
# @param Mixed $param_190
# @param Mixed $param_191
# @param Mixed $param_192
# @param Mixed $param_193
# @param Mixed $param_194
# @param Mixed $param_195
# @param Mixed $param_196
# @param Mixed $param_197
# @param Mixed $param_198
# @param Mixed $param_199
# @param Mixed $param_200
# @param Mixed $param_201
# @param Mixed $param_202
# @param Mixed $param_203
# @param Mixed $param_204
# @param Mixed $param_205
# @param Mixed $param_206
# @param Mixed $param_207
# @param Mixed $param_208
# @param Mixed $param_209
# @param Mixed $param_210
# @param Mixed $param_211
# @param Mixed $param_212
# @param Mixed $param_213
# @param Mixed $param_214
# @param Mixed $param_215
# @param Mixed $param_216
# @param Mixed $param_217
# @param Mixed $param_218
# @param Mixed $param_219
# @param Mixed $param_220
# @param Mixed $param_221
# @param Mixed $param_222
# @param Mixed $param_223
# @param Mixed $param_224
# @param Mixed $param_225
# @param Mixed $param_226
# @param Mixed $param_227
# @param Mixed $param_228
# @param Mixed $param_229
# @param Mixed $param_230
# @param Mixed $param_231
# @param Mixed $param_232
# @param Mixed $param_233
# @param Mixed $param_234
# @param Mixed $param_235
# @param Mixed $param_236
# @param Mixed $param_237
# @param Mixed $param_238
# @param Mixed $param_239
# @param Mixed $param_240
# @param Mixed $param_241
# @param Mixed $param_242
# @param Mixed $param_243
# @param Mixed $param_244
# @param Mixed $param_245
# @param Mixed $param_246
# @param Mixed $param_247
# @param Mixed $param_248
# @param Mixed $param_249
# @param Mixed $param_250
# @param Mixed $param_251
# @param Mixed $param_252
# @param Mixed $param_253
# @param Mixed $param_254
#
# @return Mixed The return value of the called function.
#ce
Func Call($function, $param_1 = Default, $param_2 = Default, $param_3 = Default, $param_4 = Default, $param_5 = Default, $param_6 = Default, $param_7 = Default, $param_8 = Default, $param_9 = Default, $param_10 = Default, $param_11 = Default, $param_12 = Default, $param_13 = Default, $param_14 = Default, $param_15 = Default, $param_16 = Default, $param_17 = Default, $param_18 = Default, $param_19 = Default, $param_20 = Default, $param_21 = Default, $param_22 = Default, $param_23 = Default, $param_24 = Default, $param_25 = Default, $param_26 = Default, $param_27 = Default, $param_28 = Default, $param_29 = Default, $param_30 = Default, $param_31 = Default, $param_32 = Default, $param_33 = Default, $param_34 = Default, $param_35 = Default, $param_36 = Default, $param_37 = Default, $param_38 = Default, $param_39 = Default, $param_40 = Default, $param_41 = Default, $param_42 = Default, $param_43 = Default, $param_44 = Default, $param_45 = Default, $param_46 = Default, $param_47 = Default, $param_48 = Default, $param_49 = Default, $param_50 = Default, $param_51 = Default, $param_52 = Default, $param_53 = Default, $param_54 = Default, $param_55 = Default, $param_56 = Default, $param_57 = Default, $param_58 = Default, $param_59 = Default, $param_60 = Default, $param_61 = Default, $param_62 = Default, $param_63 = Default, $param_64 = Default, $param_65 = Default, $param_66 = Default, $param_67 = Default, $param_68 = Default, $param_69 = Default, $param_70 = Default, $param_71 = Default, $param_72 = Default, $param_73 = Default, $param_74 = Default, $param_75 = Default, $param_76 = Default, $param_77 = Default, $param_78 = Default, $param_79 = Default, $param_80 = Default, $param_81 = Default, $param_82 = Default, $param_83 = Default, $param_84 = Default, $param_85 = Default, $param_86 = Default, $param_87 = Default, $param_88 = Default, $param_89 = Default, $param_90 = Default, $param_91 = Default, $param_92 = Default, $param_93 = Default, $param_94 = Default, $param_95 = Default, $param_96 = Default, $param_97 = Default, $param_98 = Default, $param_99 = Default, $param_100 = Default, $param_101 = Default, $param_102 = Default, $param_103 = Default, $param_104 = Default, $param_105 = Default, $param_106 = Default, $param_107 = Default, $param_108 = Default, $param_109 = Default, $param_110 = Default, $param_111 = Default, $param_112 = Default, $param_113 = Default, $param_114 = Default, $param_115 = Default, $param_116 = Default, $param_117 = Default, $param_118 = Default, $param_119 = Default, $param_120 = Default, $param_121 = Default, $param_122 = Default, $param_123 = Default, $param_124 = Default, $param_125 = Default, $param_126 = Default, $param_127 = Default, $param_128 = Default, $param_129 = Default, $param_130 = Default, $param_131 = Default, $param_132 = Default, $param_133 = Default, $param_134 = Default, $param_135 = Default, $param_136 = Default, $param_137 = Default, $param_138 = Default, $param_139 = Default, $param_140 = Default, $param_141 = Default, $param_142 = Default, $param_143 = Default, $param_144 = Default, $param_145 = Default, $param_146 = Default, $param_147 = Default, $param_148 = Default, $param_149 = Default, $param_150 = Default, $param_151 = Default, $param_152 = Default, $param_153 = Default, $param_154 = Default, $param_155 = Default, $param_156 = Default, $param_157 = Default, $param_158 = Default, $param_159 = Default, $param_160 = Default, $param_161 = Default, $param_162 = Default, $param_163 = Default, $param_164 = Default, $param_165 = Default, $param_166 = Default, $param_167 = Default, $param_168 = Default, $param_169 = Default, $param_170 = Default, $param_171 = Default, $param_172 = Default, $param_173 = Default, $param_174 = Default, $param_175 = Default, $param_176 = Default, $param_177 = Default, $param_178 = Default, $param_179 = Default, $param_180 = Default, $param_181 = Default, $param_182 = Default, $param_183 = Default, $param_184 = Default, $param_185 = Default, $param_186 = Default, $param_187 = Default, $param_188 = Default, $param_189 = Default, $param_190 = Default, $param_191 = Default, $param_192 = Default, $param_193 = Default, $param_194 = Default, $param_195 = Default, $param_196 = Default, $param_197 = Default, $param_198 = Default, $param_199 = Default, $param_200 = Default, $param_201 = Default, $param_202 = Default, $param_203 = Default, $param_204 = Default, $param_205 = Default, $param_206 = Default, $param_207 = Default, $param_208 = Default, $param_209 = Default, $param_210 = Default, $param_211 = Default, $param_212 = Default, $param_213 = Default, $param_214 = Default, $param_215 = Default, $param_216 = Default, $param_217 = Default, $param_218 = Default, $param_219 = Default, $param_220 = Default, $param_221 = Default, $param_222 = Default, $param_223 = Default, $param_224 = Default, $param_225 = Default, $param_226 = Default, $param_227 = Default, $param_228 = Default, $param_229 = Default, $param_230 = Default, $param_231 = Default, $param_232 = Default, $param_233 = Default, $param_234 = Default, $param_235 = Default, $param_236 = Default, $param_237 = Default, $param_238 = Default, $param_239 = Default, $param_240 = Default, $param_241 = Default, $param_242 = Default, $param_243 = Default, $param_244 = Default, $param_245 = Default, $param_246 = Default, $param_247 = Default, $param_248 = Default, $param_249 = Default, $param_250 = Default, $param_251 = Default, $param_252 = Default, $param_253 = Default, $param_254 = Default)
    #native code
EndFunc

#cs
# Opens or closes the CD tray.
#
# CDTray() works as expected with virtual CD drives such as DAEMON Tools.
# CDTray() does not work on non-local/mapped CD drives; CDTray() must be run from the computer whose drive it affects.
# CDTray("X:", "close") returns 1 on laptop-style cd trays that can only be closed manually.
#
# @param String $drive The drive letter of the CD tray to control, in the format D:, E:, etc.
# @param String $status Specifies if you want the CD tray to be open or closed:
# $CDTRAY_OPEN ("open") - to be open
# $CDTRAY_CLOSED ("closed") - to be closed on cd tray (not laptop-style)
# Constants are defined in AutoItConstants.au3
#
# @return 0|1 1 on success, 0 if drive is locked via CD burning software or if the drive letter is not a CD drive.
#ce
Func CDTray($drive, $status)
    #native code
EndFunc

#cs
# Returns a number rounded up to the next integer.
#
# @param Number $expression Any valid numeric expression.
#
# @return Int Returns the rounded number.
#ce
Func Ceiling($expression)
    #native code
EndFunc

#cs
# Returns a character corresponding to an ASCII code.
#
# See the ASCII Character Code table for a complete list of available values.
#
# @param Int $ASCIIcode An ASCII code in the range 0-255
#
# @return String String containing the ASCII representation of the given code on success or an empty string and sets the @error flag to 1 if the ASCIIcode is greater than 255.
#
# @see https://www.autoitscript.com/autoit3/docs/appendix/ascii.htm ASCII Character Code table
#ce
Func Chr($ASCIIcode)
    #native code
EndFunc

#cs
# Returns a character corresponding to a unicode code.
#
# See the ASCII Character Code table for a complete list of available values.
#
# @param Int $UNICODEcode A unicode code in the range 0-65535
#
# @return String String containing the representation of the given code or an empty string and sets the @error flag to non-zero if the UNICODE value is greater than 65535.
#
# @see https://www.autoitscript.com/autoit3/docs/appendix/ascii.htm ASCII Character Code table
#ce
Func ChrW($UNICODEcode)
    #native code
EndFunc

#cs
# Retrieves text from the clipboard.
#
# When multiple selecting file/dir are stored in the clipboard, the filename/dirname are returned as texts separated by @LF.
#
# @return String String containing the text on the clipboard
#
# @see https://www.autoitscript.com/autoit3/docs/functions/ClipGet.htm
#ce
Func ClipGet()
    #native code
EndFunc

#cs
# Writes text to the clipboard.
#
# Any existing clipboard contents are overwritten.
# An empty string "" will empty the clipboard.
#
# @param String $value The text to write to the clipboard.
#
# @return 0|1
#ce
Func ClipPut($value)
    #native code
EndFunc

#cs
# Read from the STDIN stream of the AutoIt script process.
#
# ConsoleRead() reads from the console standard input stream of the AutoIt script process, which is normally used by console applications to read input from a parent process.
# ConsoleRead() does not block, it will return immediately. In order to get all data, it must be called in a loop.
# Peeking on the stream does not remove the data from the buffer, however, it does return the available data as normal.
# By default, data is returned in text format. By using the binary option, the data will be returned in binary format.
#
# @param Bool $peek If True the function does not remove the read characters from the stream.
# @param Bool $binary If True the function reads the data as binary instead of text (default is text).
#
# @return String|Binary The data read @extended contains the number of bytes read on success or sets the @error flag to non-zero if EOF is reached, STDIN is not connected for the process or other error.
#ce
Func ConsoleRead($peek = False, $binary = False)
    #native code
EndFunc

#cs
# Writes data to the STDOUT stream. Some text editors can read this stream as can other programs which may be expecting data on this stream.
#
# The purpose for this function is to write to the STDOUT stream. Many popular text editors can read this stream. Scripts compiled as Console applications also have a STDOUT stream.
#
# This does not write to a DOS console unless the script is compiled as a console application.
#
# Characters are converted to ANSI before being written.
#
# Binary data is written as-is. It will not be converted to a string. To print the hex representation of binary data, use the String() function to explicitly cast the data to a string.
#
# The @error and @extended are not set on return leaving them as they were before calling. Usefull when debugging with the SciTE debugging output.
#
# @param String|Binary $data The data you wish to output. This may either be text or binary.
#
# @return Int The amount of data written. If writing binary, the number of bytes written, if writing text, the number of characters written.
#ce
Func ConsoleWrite($data)
    #native code
EndFunc

#cs
# Writes data to the STDERR stream. Some text editors can read this stream as can other programs which may be expecting data on this stream.
#
# The purpose for this function is to write to the STDERR stream. Many popular text editors can read this stream. Scripts compiled as Console applications also have a STDERR stream.
#
# This does not write to a DOS console unless the script is compiled as a console application.
#
# Characters are converted to ANSI before being written.
#
# Binary data is written as-is. It will not be converted to a string. To print the hex representation of binary data, use the String() function to explicitly cast the data to a string.
#
# The @error and @extended are not set on return leaving them as they were before calling. Usefull when debugging with the SciTE debugging output.
#
# @param String|Binary $data The data you wish to output. This may either be text or binary.
#
# @return Int The amount of data written. If writing binary, the number of bytes written, if writing text, the number of characters written.
#ce
Func ConsoleWriteError($data)
    #native code
EndFunc

#cs
# Sends a mouse click command to a given control.
#
# Some controls will resist clicking unless they are the active window. Use the WinActivate() function to force the control's window to the top before using ControlClick().
# Using 2 for the number of clicks will send a double-click message to the control - this can even be used to launch programs from an explorer control!
#
# If the user has swapped the left and right mouse buttons in the control panel, then the behaviour of the buttons is different. "Left" and "right" always click those buttons, whether the buttons are swapped or not. The "primary" or "main" button will be the main click, whether or not the buttons are swapped. The "secondary" or "menu" buttons will usually bring up the context menu, whether the buttons are swapped or not.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
# @param String $button The button to click, "left", "right", "middle", "main", "menu", "primary", "secondary". Default is the left button.
# @param Int $clicks The number of times to click the mouse.
# @param Int $x The x position to click within the control. Default is center.
# @param Int $y The y position to click within the control. Default is center.
#
# @return 0|1
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlClick($title, $text, $controlID, $button = "left", $clicks = 1, $x = @DesktopWidth / 2, $y = @DesktopHeight / 2)
    #native code
EndFunc

#cs
# Sends a command to a control.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
# @param String $command The command to send to the control.
# @param String $option Additional parameter required by some commands.
#
# @return 0|1
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlCommand($title, $text, $controlID, $command, $option = Default)
    #native code
EndFunc

#cs
# Disables or "grays-out" a control.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
#
# @return 0|1
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlDisable($title, $text, $controlID)
    #native code
EndFunc

#cs
# Enables a "grayed-out" control.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
#
# @return 0|1
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlEnable($title, $text, $controlID)
    #native code
EndFunc

#cs
# Sets input focus to a given control on a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
#
# @return 0|1
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlFocus($title, $text, $controlID)
    #native code
EndFunc

#cs
# Returns the ControlRef# of the control that has keyboard focus within a specified window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return String The ClassNameNN of the control that has keyboard focus within a specified window or empty string and sets the @error flag to 1 if window is not found.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
#ce
Func ControlGetFocus($title, $text = "")
    #native code
EndFunc

#cs
# Retrieves the internal handle of a control.
#
# This function returns a HWND/Handle value.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
#
# @return HWND The handle value or 0 and sets the @error flag to non-zero if no window matches the criteria.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlGetHandle($title, $text, $controlID)
    #native code
EndFunc

#cs
# Retrieves the position and size of a control relative to its window.
#
# The title/text is referencing the parent window, so be careful with "", which references the active window which may not be the one containing the controlID control.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
#
# @return Array An array containing the size and the control's position relative to its client window:
# $aArray[0] = X position
# $aArray[1] = Y position
# $aArray[2] = Width
# $aArray[3] = Height
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlGetPos($title, $text, $controlID)
    #native code
EndFunc

#cs
# Returns the control's current text.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
#
# @return String The text from a control or empty string and sets the @error flag to 1.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlGetText($title, $text, $controlID)
    #native code
EndFunc

#cs
# Hides a control.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
#
# @return 0|1 0 if window/control is not found.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlHide($title, $text, $controlID)
    #native code
EndFunc

#cs
# Sends a command to a ListView32 control.
#
# Some commands may fail when using a 32-bit AutoIt process to read from a 64-bit process. Likewise commands may fail when using a 64-bit AutoIt process to read from a 32-bit process.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
# @param String $command The command to send to the control.
# @param String $option1 Additional parameter required by some commands.
# @param String $option2 Additional parameter required by some commands.
#
# @return Mixed Return depends on command as table below shows. In case of an error (such as an invalid command or window/control could not be found) then @error is set to 1.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlListView($title, $text, $controlID, $command, $option1 = Default, $option2 = Default)
    #native code
EndFunc

#cs
# Moves a control within a window.
#
# If x and y equal to the Default keyword no move occurs, just resizing.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
# @param Int|Default $x X coordinate to move to relative to the window client area.
# @param Int|Default $y Y coordinate to move to relative to the window client area.
# @param Int $width The new width of the control.
# @param Int $height The new height of the control.
#
# @return 0|1 0 if window/control is not found.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlMove($title, $text, $controlID, $x, $y, $width = Default, $height = Default)
    #native code
EndFunc

#cs
# Sends a string to a control.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
# @param String $string String of characters to send to the control.
# @param 0|1 $flag Changes how "keys" is processed:
# $SEND_DEFAULT (0) = Text contains special characters like + and ! to indicate SHIFT and ALT key-presses
# $SEND_RAW (1) = keys are sent raw.
# Constants are defined in "AutoItConstants.au3".
#
# @return 0|1 0 if window/control is not found.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlSend($title, $text, $controlID, $string, $flag = 0)
    #native code
EndFunc

#cs
# Sets the text of a control.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
# @param String $new_text The new text of the control.
# @param Int $flag When different from 0 (default) will force the target window to be redrawn.
#
# @return 0|1 0 if window/control is not found.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlSetText($title, $text, $controlID, $new_text, $flag = 0)
    #native code
EndFunc

#cs
# Shows a control that was hidden.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
#
# @return 0|1 0 if window/control is not found.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlShow($title, $text, $controlID)
    #native code
EndFunc

#cs
# Sends a command to a TreeView32 control.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $controlID The control to interact with. See Controls.
# @param String $command The command to send to the control.
# @param String $option1 Additional parameter required by some commands.
#
# @return Mixed Return depends on the command as table below shows. In case of an error (such as an invalid command or window/control could not be found) then @error is set to 1.
#
# @see https://www.autoitscript.com/autoit3/docs/intro/windowsbasic.htm#specialtext Text special definition.
# @see https://www.autoitscript.com/autoit3/docs/intro/controls.htm Controls.
#ce
Func ControlTreeView($title, $text, $controlID, $command, $option1 = Default)
    #native code
EndFunc

#cs
# Calculates the cosine of a number.
#
# @param Number $expression Value in radians.
#
# @return Number The trigonometric cosine of the number.
#ce
Func Cos($expression)
    #native code
EndFunc

#cs
# Returns a numeric representation of a hexadecimal string.
#
# Default behavior is that the input string is treated as an integer. In this case, if the result is within range of a 32bit integer then it's returned as a 32bit integer, otherwise it's returned as a 64bit integer - both signed.
#
# @param String $hex The hexadecimal string to convert.
# @param 0|1|2|3 $flag Defines behavior.
# Can be one of the following:
# $NUMBER_AUTO (0 ) = string is interpreted as an integer (Default). See remarks.
# $NUMBER_32BIT (1) = string is interpreted as a 32bit integer
# $NUMBER_64BIT (2) = string is interpreted as a 64bit integer
# $NUMBER_DOUBLE (3) = string is interpreted as a double
# Constants are defined in "AutoItConstants.au3".
#
# @return Number
#ce
Func Dec($hex, $flag = 0)
    #native code
EndFunc

#cs
# Copies a directory to another.
#
# If the destination directory structure doesn't exist, it will be created (if possible).
#
# @param String $source_dir Path of the source directory (with no trailing backslash). e.g. "C:\Path1"
# @param String $dest_dir Path of the destination dir (with no trailing backslash). e.g. "C:\Path_Copy"
# @param 0|1 $flag this flag determines whether to overwrite files if they already exist:
# $FC_NOOVERWRITE (0) = (default) do not overwrite existing files
# $FC_OVERWRITE (1) = overwrite existing files
# Constants are defined in FileConstants.au3.
#
# @return 0|1 0 if there is an error copying the directory.
#ce
Func DirCopy($source_dir, $dest_dir, $flag = 0)
    #native code
EndFunc

#cs
# Creates a directory/folder.
#
# This function will also create all parent directories given in "path" if they do not already exist.
#
# @param String $path Path of the directory to create.
#
# @return 0|1 0 if there is an error creating the directory.
#ce
Func DirCreate($path)
    #native code
EndFunc

#cs
# Returns the size in bytes of a given directory.
#
# If the script is paused then this function is paused too and will only continue when the script continues!
#
# If you use the extended mode then the array returned from this function is a single dimension array containing the following elements:
# $aArray[0] = Size
# $aArray[1] = Files count
# $aArray[2] = Dirs Count
#
# @param String $path The directory path to get the size from, e.g. "C:\Windows".
# @param Int $flag this flag determines the behaviour and result of the function, and can be a combination of the following:
# $DIR_DEFAULT (0) = (default)
# $DIR_EXTENDED (1) = Extended mode is On -> returns an array that contains extended information (see Remarks).
# $DIR_NORECURSE (2) = Don't get the size of files in subdirectories (recursive mode is Off)
# Constants are defined in "AutoItConstants.au3".
#
# @return Number|Array The sizes that are greater than or equal to zero or -1 and sets the @error flag to non-zero if the path doesn't exist.
#ce
Func DirGetSize($path, $flag = 0)
    #native code
EndFunc

#cs
# Moves a directory and all sub-directories and files.
#
# If the source and destination are on different volumes or UNC paths are used then a copy/delete operation will be performed rather than a move.
#
# If the destination already exists and the overwrite flag is specified then the source directory will be moved inside the destination.
#
# AutoIt does not have a "DirRename" function as you can use this function to rename a folder using "Full_Path\Old_Name" and "Full_Path\New_Name" as the "source dir" and dest dir" parameters.
#
# @param String $source_dir Path of the source directory (with no trailing backslash). e.g. "C:\Path1"
# @param String $dest_dir Path of the destination dir (with no trailing backslash). e.g. "C:\Path_Copy"
# @param 0|1 $flag this flag determines whether to overwrite files if they already exist:
# $FC_NOOVERWRITE (0) = (default) do not overwrite existing files
# $FC_OVERWRITE (1) = overwrite existing files
# Constants are defined in FileConstants.au3.
#
# @return 0|1 0 if there is an error moving the directory.
#ce
Func DirMove($source_dir, $dest_dir, $flag = 0)
    #native code
EndFunc

#cs
# Deletes a directory/folder.
#
# Some directory attributes can make the deletion impossible, therefore if this is the case look at FileSetAttrib() to change the attributes of a directory.
#
# @param String $path Path of the directory to remove.
# @param 0|1 $recurse Use this flag to specify if you want to delete sub-directories too.
# $DIR_DEFAULT (0) = (default) deletes the folder, only if it is empty
# $DIR_REMOVE (1) = remove files and subdirectories (like the DOS DelTree command)
# Constants are define in "AutoItConstants.au3".
#
# @return 0|1 0 if there is an error removing the directory.
#ce
Func DirRemove($path, $recurse = 0)
    #native code
EndFunc

#cs
# Dynamically calls a function in a DLL.
#
# If a dll filename is given then the DLL is automatically loaded and then closed at the end of the call. If you want to manually control the loading and unloading of the DLL then you should use DllOpen() and DllClose() and use a handle instead of a filename in this function.
#
# By default, AutoIt uses the 'stdcall' calling method. To use the 'cdecl' method place ':cdecl' after the return type.
# DllCall("SQLite.dll", "int:cdecl", "sqlite3_open", "str", $sDatabase_Filename , "long*", 0).
#
# By default, AutoIt tries to use the ANSI version of a function name, i.e. MessageBoxA is attempted when MessageBox is given as the function name. To call the unicode version use MessageBoxW.
#
# If the function call fails then @error is set to non-zero.
# Otherwise an array is returned that contains the function return value and a copy of all the parameters (including parameters that the function may have modified when passed by reference).
# $return[0] = function return value
# $return[1] = param1
# $return[2] = param2
# ...
# $return[n] = paramn
#
# If an output parameter with type STR or WSTR is defined as a Null string only a maximum 65536 string will be return.
#
# @param String|Handle $dll The filename of the DLL to use or a handle obtained from DllOpen.
# @param String $return_type The return type of the function.
# @param String|Int $function The name, eg. "MessageBox" or the ordinal value, e.g. 62, of the function in the DLL to call.
# @param String $type1
# @param Mixed $param1
# @param String $type2
# @param Mixed $param2
# @param String $type3
# @param Mixed $param3
# @param String $type4
# @param Mixed $param4
# @param String $type5
# @param Mixed $param5
# @param String $type6
# @param Mixed $param6
# @param String $type7
# @param Mixed $param7
# @param String $type8
# @param Mixed $param8
# @param String $type9
# @param Mixed $param9
# @param String $type10
# @param Mixed $param10
# @param String $type11
# @param Mixed $param11
# @param String $type12
# @param Mixed $param12
# @param String $type13
# @param Mixed $param13
# @param String $type14
# @param Mixed $param14
# @param String $type15
# @param Mixed $param15
# @param String $type16
# @param Mixed $param16
# @param String $type17
# @param Mixed $param17
# @param String $type18
# @param Mixed $param18
# @param String $type19
# @param Mixed $param19
# @param String $type20
# @param Mixed $param20
# @param String $type21
# @param Mixed $param21
# @param String $type22
# @param Mixed $param22
# @param String $type23
# @param Mixed $param23
# @param String $type24
# @param Mixed $param24
# @param String $type25
# @param Mixed $param25
# @param String $type26
# @param Mixed $param26
# @param String $type27
# @param Mixed $param27
# @param String $type28
# @param Mixed $param28
# @param String $type29
# @param Mixed $param29
# @param String $type30
# @param Mixed $param30
# @param String $type31
# @param Mixed $param31
# @param String $type32
# @param Mixed $param32
# @param String $type33
# @param Mixed $param33
# @param String $type34
# @param Mixed $param34
# @param String $type35
# @param Mixed $param35
# @param String $type36
# @param Mixed $param36
# @param String $type37
# @param Mixed $param37
# @param String $type38
# @param Mixed $param38
# @param String $type39
# @param Mixed $param39
# @param String $type40
# @param Mixed $param40
# @param String $type41
# @param Mixed $param41
# @param String $type42
# @param Mixed $param42
# @param String $type43
# @param Mixed $param43
# @param String $type44
# @param Mixed $param44
# @param String $type45
# @param Mixed $param45
# @param String $type46
# @param Mixed $param46
# @param String $type47
# @param Mixed $param47
# @param String $type48
# @param Mixed $param48
# @param String $type49
# @param Mixed $param49
# @param String $type50
# @param Mixed $param50
# @param String $type51
# @param Mixed $param51
# @param String $type52
# @param Mixed $param52
# @param String $type53
# @param Mixed $param53
# @param String $type54
# @param Mixed $param54
# @param String $type55
# @param Mixed $param55
# @param String $type56
# @param Mixed $param56
# @param String $type57
# @param Mixed $param57
# @param String $type58
# @param Mixed $param58
# @param String $type59
# @param Mixed $param59
# @param String $type60
# @param Mixed $param60
# @param String $type61
# @param Mixed $param61
# @param String $type62
# @param Mixed $param62
# @param String $type63
# @param Mixed $param63
# @param String $type64
# @param Mixed $param64
# @param String $type65
# @param Mixed $param65
# @param String $type66
# @param Mixed $param66
# @param String $type67
# @param Mixed $param67
# @param String $type68
# @param Mixed $param68
# @param String $type69
# @param Mixed $param69
# @param String $type70
# @param Mixed $param70
# @param String $type71
# @param Mixed $param71
# @param String $type72
# @param Mixed $param72
# @param String $type73
# @param Mixed $param73
# @param String $type74
# @param Mixed $param74
# @param String $type75
# @param Mixed $param75
# @param String $type76
# @param Mixed $param76
# @param String $type77
# @param Mixed $param77
# @param String $type78
# @param Mixed $param78
# @param String $type79
# @param Mixed $param79
# @param String $type80
# @param Mixed $param80
# @param String $type81
# @param Mixed $param81
# @param String $type82
# @param Mixed $param82
# @param String $type83
# @param Mixed $param83
# @param String $type84
# @param Mixed $param84
# @param String $type85
# @param Mixed $param85
# @param String $type86
# @param Mixed $param86
# @param String $type87
# @param Mixed $param87
# @param String $type88
# @param Mixed $param88
# @param String $type89
# @param Mixed $param89
# @param String $type90
# @param Mixed $param90
# @param String $type91
# @param Mixed $param91
# @param String $type92
# @param Mixed $param92
# @param String $type93
# @param Mixed $param93
# @param String $type94
# @param Mixed $param94
# @param String $type95
# @param Mixed $param95
# @param String $type96
# @param Mixed $param96
# @param String $type97
# @param Mixed $param97
# @param String $type98
# @param Mixed $param98
# @param String $type99
# @param Mixed $param99
# @param String $type100
# @param Mixed $param100
# @param String $type101
# @param Mixed $param101
# @param String $type102
# @param Mixed $param102
# @param String $type103
# @param Mixed $param103
# @param String $type104
# @param Mixed $param104
# @param String $type105
# @param Mixed $param105
# @param String $type106
# @param Mixed $param106
# @param String $type107
# @param Mixed $param107
# @param String $type108
# @param Mixed $param108
# @param String $type109
# @param Mixed $param109
# @param String $type110
# @param Mixed $param110
# @param String $type111
# @param Mixed $param111
# @param String $type112
# @param Mixed $param112
# @param String $type113
# @param Mixed $param113
# @param String $type114
# @param Mixed $param114
# @param String $type115
# @param Mixed $param115
# @param String $type116
# @param Mixed $param116
# @param String $type117
# @param Mixed $param117
# @param String $type118
# @param Mixed $param118
# @param String $type119
# @param Mixed $param119
# @param String $type120
# @param Mixed $param120
# @param String $type121
# @param Mixed $param121
# @param String $type122
# @param Mixed $param122
# @param String $type123
# @param Mixed $param123
# @param String $type124
# @param Mixed $param124
# @param String $type125
# @param Mixed $param125
# @param String $type126
# @param Mixed $param126
#
# @return Array
#ce
Func DllCall($dll, $return_type, $function, $type1 = Default, $param1 = Default, $type2 = Default, $param2 = Default, $type3 = Default, $param3 = Default, $type4 = Default, $param4 = Default, $type5 = Default, $param5 = Default, $type6 = Default, $param6 = Default, $type7 = Default, $param7 = Default, $type8 = Default, $param8 = Default, $type9 = Default, $param9 = Default, $type10 = Default, $param10 = Default, $type11 = Default, $param11 = Default, $type12 = Default, $param12 = Default, $type13 = Default, $param13 = Default, $type14 = Default, $param14 = Default, $type15 = Default, $param15 = Default, $type16 = Default, $param16 = Default, $type17 = Default, $param17 = Default, $type18 = Default, $param18 = Default, $type19 = Default, $param19 = Default, $type20 = Default, $param20 = Default, $type21 = Default, $param21 = Default, $type22 = Default, $param22 = Default, $type23 = Default, $param23 = Default, $type24 = Default, $param24 = Default, $type25 = Default, $param25 = Default, $type26 = Default, $param26 = Default, $type27 = Default, $param27 = Default, $type28 = Default, $param28 = Default, $type29 = Default, $param29 = Default, $type30 = Default, $param30 = Default, $type31 = Default, $param31 = Default, $type32 = Default, $param32 = Default, $type33 = Default, $param33 = Default, $type34 = Default, $param34 = Default, $type35 = Default, $param35 = Default, $type36 = Default, $param36 = Default, $type37 = Default, $param37 = Default, $type38 = Default, $param38 = Default, $type39 = Default, $param39 = Default, $type40 = Default, $param40 = Default, $type41 = Default, $param41 = Default, $type42 = Default, $param42 = Default, $type43 = Default, $param43 = Default, $type44 = Default, $param44 = Default, $type45 = Default, $param45 = Default, $type46 = Default, $param46 = Default, $type47 = Default, $param47 = Default, $type48 = Default, $param48 = Default, $type49 = Default, $param49 = Default, $type50 = Default, $param50 = Default, $type51 = Default, $param51 = Default, $type52 = Default, $param52 = Default, $type53 = Default, $param53 = Default, $type54 = Default, $param54 = Default, $type55 = Default, $param55 = Default, $type56 = Default, $param56 = Default, $type57 = Default, $param57 = Default, $type58 = Default, $param58 = Default, $type59 = Default, $param59 = Default, $type60 = Default, $param60 = Default, $type61 = Default, $param61 = Default, $type62 = Default, $param62 = Default, $type63 = Default, $param63 = Default, $type64 = Default, $param64 = Default, $type65 = Default, $param65 = Default, $type66 = Default, $param66 = Default, $type67 = Default, $param67 = Default, $type68 = Default, $param68 = Default, $type69 = Default, $param69 = Default, $type70 = Default, $param70 = Default, $type71 = Default, $param71 = Default, $type72 = Default, $param72 = Default, $type73 = Default, $param73 = Default, $type74 = Default, $param74 = Default, $type75 = Default, $param75 = Default, $type76 = Default, $param76 = Default, $type77 = Default, $param77 = Default, $type78 = Default, $param78 = Default, $type79 = Default, $param79 = Default, $type80 = Default, $param80 = Default, $type81 = Default, $param81 = Default, $type82 = Default, $param82 = Default, $type83 = Default, $param83 = Default, $type84 = Default, $param84 = Default, $type85 = Default, $param85 = Default, $type86 = Default, $param86 = Default, $type87 = Default, $param87 = Default, $type88 = Default, $param88 = Default, $type89 = Default, $param89 = Default, $type90 = Default, $param90 = Default, $type91 = Default, $param91 = Default, $type92 = Default, $param92 = Default, $type93 = Default, $param93 = Default, $type94 = Default, $param94 = Default, $type95 = Default, $param95 = Default, $type96 = Default, $param96 = Default, $type97 = Default, $param97 = Default, $type98 = Default, $param98 = Default, $type99 = Default, $param99 = Default, $type100 = Default, $param100 = Default, $type101 = Default, $param101 = Default, $type102 = Default, $param102 = Default, $type103 = Default, $param103 = Default, $type104 = Default, $param104 = Default, $type105 = Default, $param105 = Default, $type106 = Default, $param106 = Default, $type107 = Default, $param107 = Default, $type108 = Default, $param108 = Default, $type109 = Default, $param109 = Default, $type110 = Default, $param110 = Default, $type111 = Default, $param111 = Default, $type112 = Default, $param112 = Default, $type113 = Default, $param113 = Default, $type114 = Default, $param114 = Default, $type115 = Default, $param115 = Default, $type116 = Default, $param116 = Default, $type117 = Default, $param117 = Default, $type118 = Default, $param118 = Default, $type119 = Default, $param119 = Default, $type120 = Default, $param120 = Default, $type121 = Default, $param121 = Default, $type122 = Default, $param122 = Default, $type123 = Default, $param123 = Default, $type124 = Default, $param124 = Default, $type125 = Default, $param125 = Default, $type126 = Default, $param126 = Default)
    #native code
EndFunc;TODO: support DLLCALL param types (currently shown as a table in official docs)

#cs
# Dynamically calls a function at a specific memory address.
#
# @param String $return_type The return type of the function.
# @param Ptr $address The address of a function. If this value is invalid your script will crash!
# @param String $type1
# @param Mixed $param1
# @param String $type2
# @param Mixed $param2
# @param String $type3
# @param Mixed $param3
# @param String $type4
# @param Mixed $param4
# @param String $type5
# @param Mixed $param5
# @param String $type6
# @param Mixed $param6
# @param String $type7
# @param Mixed $param7
# @param String $type8
# @param Mixed $param8
# @param String $type9
# @param Mixed $param9
# @param String $type10
# @param Mixed $param10
# @param String $type11
# @param Mixed $param11
# @param String $type12
# @param Mixed $param12
# @param String $type13
# @param Mixed $param13
# @param String $type14
# @param Mixed $param14
# @param String $type15
# @param Mixed $param15
# @param String $type16
# @param Mixed $param16
# @param String $type17
# @param Mixed $param17
# @param String $type18
# @param Mixed $param18
# @param String $type19
# @param Mixed $param19
# @param String $type20
# @param Mixed $param20
# @param String $type21
# @param Mixed $param21
# @param String $type22
# @param Mixed $param22
# @param String $type23
# @param Mixed $param23
# @param String $type24
# @param Mixed $param24
# @param String $type25
# @param Mixed $param25
# @param String $type26
# @param Mixed $param26
# @param String $type27
# @param Mixed $param27
# @param String $type28
# @param Mixed $param28
# @param String $type29
# @param Mixed $param29
# @param String $type30
# @param Mixed $param30
# @param String $type31
# @param Mixed $param31
# @param String $type32
# @param Mixed $param32
# @param String $type33
# @param Mixed $param33
# @param String $type34
# @param Mixed $param34
# @param String $type35
# @param Mixed $param35
# @param String $type36
# @param Mixed $param36
# @param String $type37
# @param Mixed $param37
# @param String $type38
# @param Mixed $param38
# @param String $type39
# @param Mixed $param39
# @param String $type40
# @param Mixed $param40
# @param String $type41
# @param Mixed $param41
# @param String $type42
# @param Mixed $param42
# @param String $type43
# @param Mixed $param43
# @param String $type44
# @param Mixed $param44
# @param String $type45
# @param Mixed $param45
# @param String $type46
# @param Mixed $param46
# @param String $type47
# @param Mixed $param47
# @param String $type48
# @param Mixed $param48
# @param String $type49
# @param Mixed $param49
# @param String $type50
# @param Mixed $param50
# @param String $type51
# @param Mixed $param51
# @param String $type52
# @param Mixed $param52
# @param String $type53
# @param Mixed $param53
# @param String $type54
# @param Mixed $param54
# @param String $type55
# @param Mixed $param55
# @param String $type56
# @param Mixed $param56
# @param String $type57
# @param Mixed $param57
# @param String $type58
# @param Mixed $param58
# @param String $type59
# @param Mixed $param59
# @param String $type60
# @param Mixed $param60
# @param String $type61
# @param Mixed $param61
# @param String $type62
# @param Mixed $param62
# @param String $type63
# @param Mixed $param63
# @param String $type64
# @param Mixed $param64
# @param String $type65
# @param Mixed $param65
# @param String $type66
# @param Mixed $param66
# @param String $type67
# @param Mixed $param67
# @param String $type68
# @param Mixed $param68
# @param String $type69
# @param Mixed $param69
# @param String $type70
# @param Mixed $param70
# @param String $type71
# @param Mixed $param71
# @param String $type72
# @param Mixed $param72
# @param String $type73
# @param Mixed $param73
# @param String $type74
# @param Mixed $param74
# @param String $type75
# @param Mixed $param75
# @param String $type76
# @param Mixed $param76
# @param String $type77
# @param Mixed $param77
# @param String $type78
# @param Mixed $param78
# @param String $type79
# @param Mixed $param79
# @param String $type80
# @param Mixed $param80
# @param String $type81
# @param Mixed $param81
# @param String $type82
# @param Mixed $param82
# @param String $type83
# @param Mixed $param83
# @param String $type84
# @param Mixed $param84
# @param String $type85
# @param Mixed $param85
# @param String $type86
# @param Mixed $param86
# @param String $type87
# @param Mixed $param87
# @param String $type88
# @param Mixed $param88
# @param String $type89
# @param Mixed $param89
# @param String $type90
# @param Mixed $param90
# @param String $type91
# @param Mixed $param91
# @param String $type92
# @param Mixed $param92
# @param String $type93
# @param Mixed $param93
# @param String $type94
# @param Mixed $param94
# @param String $type95
# @param Mixed $param95
# @param String $type96
# @param Mixed $param96
# @param String $type97
# @param Mixed $param97
# @param String $type98
# @param Mixed $param98
# @param String $type99
# @param Mixed $param99
# @param String $type100
# @param Mixed $param100
# @param String $type101
# @param Mixed $param101
# @param String $type102
# @param Mixed $param102
# @param String $type103
# @param Mixed $param103
# @param String $type104
# @param Mixed $param104
# @param String $type105
# @param Mixed $param105
# @param String $type106
# @param Mixed $param106
# @param String $type107
# @param Mixed $param107
# @param String $type108
# @param Mixed $param108
# @param String $type109
# @param Mixed $param109
# @param String $type110
# @param Mixed $param110
# @param String $type111
# @param Mixed $param111
# @param String $type112
# @param Mixed $param112
# @param String $type113
# @param Mixed $param113
# @param String $type114
# @param Mixed $param114
# @param String $type115
# @param Mixed $param115
# @param String $type116
# @param Mixed $param116
# @param String $type117
# @param Mixed $param117
# @param String $type118
# @param Mixed $param118
# @param String $type119
# @param Mixed $param119
# @param String $type120
# @param Mixed $param120
# @param String $type121
# @param Mixed $param121
# @param String $type122
# @param Mixed $param122
# @param String $type123
# @param Mixed $param123
# @param String $type124
# @param Mixed $param124
# @param String $type125
# @param Mixed $param125
# @param String $type126
# @param Mixed $param126
#
# @return Array
#ce
Func DllCallAddress($return_type, $address, $type1 = Default, $param1 = Default, $type2 = Default, $param2 = Default, $type3 = Default, $param3 = Default, $type4 = Default, $param4 = Default, $type5 = Default, $param5 = Default, $type6 = Default, $param6 = Default, $type7 = Default, $param7 = Default, $type8 = Default, $param8 = Default, $type9 = Default, $param9 = Default, $type10 = Default, $param10 = Default, $type11 = Default, $param11 = Default, $type12 = Default, $param12 = Default, $type13 = Default, $param13 = Default, $type14 = Default, $param14 = Default, $type15 = Default, $param15 = Default, $type16 = Default, $param16 = Default, $type17 = Default, $param17 = Default, $type18 = Default, $param18 = Default, $type19 = Default, $param19 = Default, $type20 = Default, $param20 = Default, $type21 = Default, $param21 = Default, $type22 = Default, $param22 = Default, $type23 = Default, $param23 = Default, $type24 = Default, $param24 = Default, $type25 = Default, $param25 = Default, $type26 = Default, $param26 = Default, $type27 = Default, $param27 = Default, $type28 = Default, $param28 = Default, $type29 = Default, $param29 = Default, $type30 = Default, $param30 = Default, $type31 = Default, $param31 = Default, $type32 = Default, $param32 = Default, $type33 = Default, $param33 = Default, $type34 = Default, $param34 = Default, $type35 = Default, $param35 = Default, $type36 = Default, $param36 = Default, $type37 = Default, $param37 = Default, $type38 = Default, $param38 = Default, $type39 = Default, $param39 = Default, $type40 = Default, $param40 = Default, $type41 = Default, $param41 = Default, $type42 = Default, $param42 = Default, $type43 = Default, $param43 = Default, $type44 = Default, $param44 = Default, $type45 = Default, $param45 = Default, $type46 = Default, $param46 = Default, $type47 = Default, $param47 = Default, $type48 = Default, $param48 = Default, $type49 = Default, $param49 = Default, $type50 = Default, $param50 = Default, $type51 = Default, $param51 = Default, $type52 = Default, $param52 = Default, $type53 = Default, $param53 = Default, $type54 = Default, $param54 = Default, $type55 = Default, $param55 = Default, $type56 = Default, $param56 = Default, $type57 = Default, $param57 = Default, $type58 = Default, $param58 = Default, $type59 = Default, $param59 = Default, $type60 = Default, $param60 = Default, $type61 = Default, $param61 = Default, $type62 = Default, $param62 = Default, $type63 = Default, $param63 = Default, $type64 = Default, $param64 = Default, $type65 = Default, $param65 = Default, $type66 = Default, $param66 = Default, $type67 = Default, $param67 = Default, $type68 = Default, $param68 = Default, $type69 = Default, $param69 = Default, $type70 = Default, $param70 = Default, $type71 = Default, $param71 = Default, $type72 = Default, $param72 = Default, $type73 = Default, $param73 = Default, $type74 = Default, $param74 = Default, $type75 = Default, $param75 = Default, $type76 = Default, $param76 = Default, $type77 = Default, $param77 = Default, $type78 = Default, $param78 = Default, $type79 = Default, $param79 = Default, $type80 = Default, $param80 = Default, $type81 = Default, $param81 = Default, $type82 = Default, $param82 = Default, $type83 = Default, $param83 = Default, $type84 = Default, $param84 = Default, $type85 = Default, $param85 = Default, $type86 = Default, $param86 = Default, $type87 = Default, $param87 = Default, $type88 = Default, $param88 = Default, $type89 = Default, $param89 = Default, $type90 = Default, $param90 = Default, $type91 = Default, $param91 = Default, $type92 = Default, $param92 = Default, $type93 = Default, $param93 = Default, $type94 = Default, $param94 = Default, $type95 = Default, $param95 = Default, $type96 = Default, $param96 = Default, $type97 = Default, $param97 = Default, $type98 = Default, $param98 = Default, $type99 = Default, $param99 = Default, $type100 = Default, $param100 = Default, $type101 = Default, $param101 = Default, $type102 = Default, $param102 = Default, $type103 = Default, $param103 = Default, $type104 = Default, $param104 = Default, $type105 = Default, $param105 = Default, $type106 = Default, $param106 = Default, $type107 = Default, $param107 = Default, $type108 = Default, $param108 = Default, $type109 = Default, $param109 = Default, $type110 = Default, $param110 = Default, $type111 = Default, $param111 = Default, $type112 = Default, $param112 = Default, $type113 = Default, $param113 = Default, $type114 = Default, $param114 = Default, $type115 = Default, $param115 = Default, $type116 = Default, $param116 = Default, $type117 = Default, $param117 = Default, $type118 = Default, $param118 = Default, $type119 = Default, $param119 = Default, $type120 = Default, $param120 = Default, $type121 = Default, $param121 = Default, $type122 = Default, $param122 = Default, $type123 = Default, $param123 = Default, $type124 = Default, $param124 = Default, $type125 = Default, $param125 = Default, $type126 = Default, $param126 = Default)
    #native code
EndFunc

#cs
# Frees a previously created handle created with DllCallbackRegister.
#
# @param Handle $handle The DllCallback handle, as returned by a previous call to DllCallbackRegister().
#
# @return Void
#ce
Func DllCallbackFree($handle)
    #native code
EndFunc

#cs
# Returns the pointer to a callback function that can be passed to the Win32 API.
#
# @param Handle $handle A DllCallback handle returned from DllCallbackRegister().
#
# @return Ptr the pointer to the callback function.
#ce
Func DllCallbackGetPtr($handle)
    #native code
EndFunc

#cs
# Creates a user-defined DLL Callback function.
#
# @param String $function The name of the User Defined Function to call.
# @param String $return_type The return type and calling convention of the function (see DllCall).
# @param String $params A semi-colon separated list of parameters that will be passed to this function. See Remarks.
#
# @return Handle A dll "handle" to be used with DllCallbackGetPtr() and DllCallbackFree() functions.
#ce
Func DllCallbackRegister($function, $return_type, $params)
    #native code
EndFunc

#cs
# Closes a previously opened DLL.
#
# @param Handle $dllhandle The handle of a dll, as returned by a previous call to DllOpen().
#
# @return Void
#ce
Func DllClose($dllhandle)
    #native code
EndFunc

#cs
# Opens a DLL file for use in DllCall.
#
# @param String $filename Filename of the DLL file to open.
#
# @return Handle a dll "handle" to be used with subsequent Dll functions or -1 if error occurs.
#ce
Func DllOpen($filename)
    #native code
EndFunc

#cs
# Creates a C/C++ style structure to be used in DllCall.
#
# @param String $struct A string representing the structure to create (See Remarks).
# @param Ptr $pointer If supplied the struct will not allocate memory but use the pointer supplied.
#
# @return Handle
#ce
Func DllStructCreate($struct, $pointer = Default)
    #native code
EndFunc

#cs
# Returns the data of an element of the struct.
#
# @param Handle $struct The struct returned by DllStructCreate().
# @param String $element Which element of the struct you want to access, starting at 1 or the element name as defined in DllStructCreate().
# @param Int $index For elements that are defined by [] this specifies the 1-based index to retrieve. If omitted or the Default keyword then for char[n], wchar[n] and byte[n] all elements are retrieved (Useful for quick retrieval).
# Not used for non [] elements.
#
# @return Mixed
#ce
Func DllStructGetData($struct, $element, $index = Default)
    #native code
EndFunc

#cs
# Returns the pointer to the struct or an element in the struct.
#
# @param Handle $struct The struct returned by DllStructCreate().
# @param String|Int $element The element of the struct whose pointer you need, starting at 1 or the element name as defined in DllStructCreate().
#
# @return Ptr The pointer to the struct
#ce
Func DllStructGetPtr($struct, $element = Default)
    #native code
EndFunc

#cs
# Returns the size of the struct in bytes.
#
# @param Handle $struct The struct returned by DllStructCreate().
#
# @return Int The size of the struct in bytes.
#ce
Func DllStructGetSize($struct)
    #native code
EndFunc

#cs
# Sets the data of an element in the struct.
#
# @param Handle $struct The struct returned by DllStructCreate().
# @param String $element Which element of the struct you want to access, starting at 1 or the element name as defined in DllStructCreate().
# @param Mixed $value The new value to place in the struct element.
# @param Int $index For elements that are an array this specifies the 1-based index to set. If omitted or the Default keyword then as much of the value as possible will be set in element starting at index 1 (Useful for quickly setting strings). Not used for non-array elements.
#
# @return Mixed Value, which is read back from the struct.
#ce
Func DllStructSetData($struct, $element, $value, $index = Default)
    #native code
EndFunc

#cs
# Returns an array containing the enumerated drives.
#
# @param String $type Type of drive to find:
# $DT_ALL ("ALL")
# $DT_CDROM ("CDROM")
# $DT_REMOVABLE ("REMOVABLE")
# $DT_FIXED ("FIXED")
# $DT_NETWORK ("NETWORK")
# $DT_RAMDISK ("RAMDISK")
# $DT_UNKNOWN ("UNKNOWN")
# Constants are defined in AutoItConstants.au3
#
# @return Array An array of strings (drive letter followed by colon) of drives found. The zeroth array element contains the number of drives.
#ce
Func DriveGetDrive($type)
    #native code
EndFunc

#cs
# Returns File System Type of a drive.
#
# @param String $path Path of drive to receive information from.
#
# @return String The File System Type of the drive as a string
#ce
Func DriveGetFileSystem($path)
    #native code
EndFunc

#cs
# Returns Volume Label of a drive, if it has one.
#
# @param String $path Path of drive to receive information from.
#
# @return String The Volume Label of the drive
#ce
Func DriveGetLabel($path)
    #native code
EndFunc

#cs
# Returns Serial Number of a drive.
#
# The value returned is not the hardware serial number as found on the label of the drive, it is the Windows Volume ID for the drive.
#
# @param String $path Path of drive to receive information from.
#
# @return String The Serial Number of the drive
#ce
Func DriveGetSerial($path)
    #native code
EndFunc

#cs
# Returns drive type.
#
# @param String $path Path of drive to receive information from.
# @param Int $operation The drive type operation to perform.
# $DT_DRIVETYPE (1) = the type of drive (default)
# $DT_SSDSTATUS (2) = SSD status of the drive
# $DT_BUSTYPE (3) = the bus type of drive
# Constants are defined in AutoItConstants.au3.
#
# @return String The drive type
#ce
Func DriveGetType($path, $operation = 1)
    #native code
EndFunc

#cs
# Maps a network drive.
#
# @param String $device The device to map, for example "O:" or "LPT1:". If you pass an empty string for this parameter a connection is made but not mapped to a specific drive. If you specify "*" an unused drive letter will be automatically selected.
# @param String $remote_share The remote share to connect to in the form "\\server\share".
# @param Int $flags Any combination of the following:
# $DMA_DEFAULT (0) = default
# $DMA_PERSISTENT (1) = Persistent mapping
# $DMA_AUTHENTICATION (8) = Show authentication dialog if required
# Constants are defined in AutoItConstants.au3.
# @param String $user The username to use to connect. In the form "username" or "domain\username".
# @param String $password The password to use to connect.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func DriveMapAdd($device, $remote_share, $flags = 0, $user = Default, $password = Default)
    #native code
EndFunc

#cs
# Disconnects a network drive.
#
# @param String $device The device to disconnect, e.g. "O:" or "LPT1:".
#
# @return 0|1 1 if successful, 0 if the disconnection was unsuccessful.
#ce
Func DriveMapDel($drive)
    #native code
EndFunc

#cs
# Retrieves the details of a mapped drive.
#
# @param String $device The device to retrieve, e.g. "O:" or "LPT1:".
#
# @return String A details of the mapping, e.g. \\server\share
#ce
Func DriveMapGet($device)
    #native code
EndFunc

#cs
# Sets the Volume Label of a drive.
#
# @param String $path Path of drive to change.
# @param String $label New volume label for the drive. (11 characters is usually max length)
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func DriveSetLabel($path, $label)
    #native code
EndFunc

#cs
# Returns the free disk space of a path in Megabytes.
#
# @param String $path Path of drive to receive information from.
#
# @return Float The free disk space of the drive
#ce
Func DriveSpaceFree($path)
    #native code
EndFunc

#cs
# Returns the total disk space of a path in Megabytes.
#
# @param String $path Path of drive to receive information from.
#
# @return Float The total disk space of the drive
#ce
Func DriveSpaceTotal($path)
    #native code
EndFunc

#cs
# Returns the status of the drive
#
# @param String $path Path of drive to receive information from.
#
# @return String The status of the drive
#ce
Func DriveStatus($path)
    #native code
EndFunc

#cs
# Retrieves an environment variable.
#
# @param String $envvariable The name of the environment variable to get such as "TEMP" or "PATH".
#
# @return String The value of the environment variable or empty string if the variable does not exist.
#ce
Func EnvGet($envvariable)
    #native code
EndFunc

#cs
# Writes an environment variable.
#
# If a value is not used the environment variable will be deleted.
#
# @param String $envvariable The name of the environment variable to set such as "TEMP" or "PATH".
# @param String $value The value of the environment variable.
#
# @return Int 0 if unsuccessful, any other value if successful.
#ce
Func EnvSet($envvariable, $value = Default)
    #native code
EndFunc

#cs
# Refreshes the OS environment.
#
# @return Void
#ce
Func EnvUpdate()
    #native code
EndFunc

#cs
# Return the value of the variable defined by a string.
#
# @param String $variable The name of the variable.
#
# @return Mixed The value of the variable or empty string and sets the @error flag to non-zero on failure.
#ce
Func Eval($string)
    #native code
EndFunc

#cs
# Execute an expression.
#
# @param String $string The expression to be evaluated.
#
# @return Mixed The value of the evaluated expression or empty string and sets the @error flag to non-zero on failure.
#ce
Func Execute($string)
    #native code
EndFunc

#cs
# Calculates e to the power of a number.
#
# @param Number $expression Any valid numeric expression.
#
# @return Double
#ce
Func Exp($expression)
    #native code
EndFunc

#cs
# Changes the current working directory.
#
# @param String $path The path to make the current working directory.
#
# @return 0|1 1 if successful, 0 if working directory was not changed.
#ce
Func FileChangeDir($path)
    #native code
EndFunc

#cs
# Closes a previously opened file.
#
# @param Int $filehandle The handle of a file, as returned by a previous call to FileOpen().
#
# @return 0|1 1 if successful, 0 if the filehandle is invalid.
#ce
Func FileClose($filehandle)
    #native code
EndFunc

#cs
# Copies one or more files.
#
# @param String $source The source path of the file(s) to copy.
# @param String $dest The destination path of the copied file(s).
# @param Int $flag The flag to determine whether to overwrite files if they already exist.
# Can be a combination of the following:
# $FC_NOOVERWRITE (0) = (default) do not overwrite existing files
# $FC_OVERWRITE (1) = overwrite existing files
# $FC_CREATEPATH (8) = Create destination directory structure if it doesn't exist (See Remarks).
# Constants are defined in FileConstants.au3.
#
# @return 0|1 1 if successful, 0 if the file(s) could not be copied.
#ce
Func FileCopy($source, $dest, $flag = 0)
    #native code
EndFunc

#cs
# Creates an NTFS hardlink to a file or a directory.
#
# @param String $source Path of the source to which the hardlink will be created.
# @param String $hardlink Path of the hardlink.
# @param Int $flag Determines whether to overwrite link if they already exist.
# Can be a combination of the following:
# $FC_NOOVERWRITE (0) = (default) do not overwrite existing link
# $FC_OVERWRITE (1) = overwrite existing link
# Constants are defined in FileConstants.au3.
#
# @return 0|1 1 if successful, 0 on failure.
#ce
Func FileCreateNTFSLink($source, $hardlink, $flag = 0)
    #native code
EndFunc

#cs
# Creates a shortcut (.lnk) to a file.
#
# @param String $file Full path and file name of file to which the shortcut will point.
# @param String $lnk Full path and file name of the shortcut.
# @param String $workdir Working directory.
# @param String $args Additional file arguments.
# @param String $desc File Description.
# @param String $icon Full Path/File name of icon to use.
# @param String $hotkey Hotkey - same as the Send() key format.
# @param Int $icon_number The icon instance to use (usually 0)
# @param Int $state The state the shortcut is launched in. Use either @SW_SHOWNORMAL, @SW_SHOWMINNOACTIVE or @SW_SHOWMAXIMIZED
#
# @return 0|1 1 if successful, 0 if lnk cannot be created.
#ce
Func FileCreateShortcut($file, $lnk, $workdir = Default, $args = Default, $desc = Default, $icon = Default, $hotkey = Default, $icon_number = Default, $state = Default)
    #native code
EndFunc

#cs
# Delete one or more files.
#
# @param String $filename The path of the file(s) to delete.
#
# @return 0|1 1 if successful, 0 if files are not deleted or do not exist.
#ce
Func FileDelete($filename)
    #native code
EndFunc

#cs
# Checks if a file or directory exists.
#
# @param String $path The path of the file or directory to check.
#
# @return 0|1 1 if successful, 0 if path/file does not exist.
#ce
Func FileExists($path)
    #native code
EndFunc

#cs
# Creates a search handle, defined by a path and file mask.
#
# @param String $filename The path and file mask to search for.
#
# @return Handle The search handle or -1 if nothing is found. The value of the @error flag is set to 1 only if the Folder is empty.
#ce
Func FileFindFirstFile($filename)
    #native code
EndFunc

#cs
# Returns the next filename defined by the search handle.
#
# @param Handle $search The search handle, as returned by FileFindFirstFile().
# @param Int32 $flag Determines whether to return detailed file attribute information in @extended.
# 0 = (default) use @extended to return 1 or 0 if search item is a directory.
# 1 = Return a string in @extended in the same format as FileGetAttrib().
#
# @return String The filename or path and filename.
#ce
Func FileFindNextFile($search, $flag = 0)
    #native code
EndFunc

#cs
# Flushes the file's buffer to disk.
#
# @param Handle $filehandle The file handle to flush.
#
# @return Boolean True if the buffer was flushed (or did not need to be flushed), False if the buffer could not be flushed.
#ce
Func FileFlush($filehandle)
    #native code
EndFunc

#cs
# Returns a code string representing a file's attributes.
#
# @param String $filename The path and filename.
#
# @return String The code string.
#ce
Func FileGetAttrib($filename)
    #native code
EndFunc

#cs
# Determines the text encoding used in a file.
#
# @param String|Handle $file The handle of a file or string filename
# @param 1|2 $mode The UTF8 detection mode to use.
# $FE_ENTIRE_UTF8 (1) = Check entire file for UTF8 sequences (default)
# $FE_PARTIALFIRST_UTF8 (2) = Check first part of file for UTF8 sequences (the same as FileOpen() uses by default)
# Constants are defined in FileConstants.au3.
#
# @return Int
#ce
Func FileGetEncoding($file, $mode = 1)
    #native code
EndFunc

#cs
# Returns the long path+name of the path+name passed.
#
# @param String $filename Full path and file name to convert
# @param 0|1 $flag 
# $FN_FULLPATH (0) - Default
# $FN_RELATIVEPATH (1) - file can have relative dir, e.g. "..\file.txt"
#
# @return String The long path+name of the path+name passed.
#ce
Func FileGetLongName($filename, $flag = 0)
    #native code
EndFunc

#cs
# Retrieves the current file position.
#
# @param Handle $filehandle The file handle
#
# @return Int the position offset from the beginning of the file (First index is 0) or 0 and sets the @error flag to non-zero on failure.
#ce
Func FileGetPos($filehandle)
    #native code
EndFunc

#cs
# Retrieves details about a shortcut.
#
# @param String $lnk The path and filename of the shortcut.
#
# @return Array
#ce
Func FileGetShortcut($lnk)
    #native code
EndFunc

#cs
# Returns the short path+name of the path+name passed.
#
# @param String $filename Full path and file name to convert
# @param 0|1 $flag 
# $FN_FULLPATH (0) - Default
# $FN_RELATIVEPATH (1) - file can have relative dir, e.g. "..\file.txt"
# Constants are defined in FileConstants.au3.
#
# @return String The short path+name of the path+name passed.
#ce
Func FileGetShortName($filename, $flag = 0)
    #native code
EndFunc

#cs
# Returns the size of a file in bytes.
#
# @param String $filename The path and filename.
#
# @return Int The file size in bytes or 0 and sets the @error flag to non-zero on failure.
#ce
Func FileGetSize($filename)
    #native code
EndFunc

#cs
# Returns the time a file was last modified.
#
# @param String $filenamem The path and filename.
# @param 0|1|2 $option Flag to indicate which timestamp
# $FT_MODIFIED (0) = Last modified (default)
# $FT_CREATED (1) = Created
# $FT_ACCESSED (2) = Last accessed
# Constants are defined in FileConstants.au3
# @param 0|1|2 $format Flag to indicate which format
# $FT_ARRAY (0) = return an array (default)
# $FT_STRING (1) = return a string YYYYMMDDHHMMSS
# $FT_MSEC (2) = return Milliseconds
# $FT_UTC (4) = return UTC time instead of Local time
# Constants are defined in FileConstants.au3
#
# @return Array The time and date information of the file was last modified or 0 and sets the @error flag to non-zero on failure.
#ce
Func FileGetTime($filenamem, $option = 0, $format = 0)
    #native code
EndFunc

#cs
# Returns version information stored in a file.
#
# @param String $filename The path and filename.
# @param String $stringname Name of the string field to be retrieved from the header version file info:
# $FV_COMMENTS ("Comments")
# $FV_COMPANYNAME ("CompanyName")
# $FV_FILEDESCRIPTION ("FileDescription")
# $FV_FILEVERSION ("FileVersion")
# $FV_INTERNALNAME ("InternalName")
# $FV_LEGALCOPYRIGHT ("LegalCopyright")
# $FV_LEGALTRADEMARKS ("LegalTrademarks")
# $FV_ORIGINALFILENAME ("OriginalFilename")
# $FV_PRODUCTNAME ("ProductName")
# $FV_PRODUCTVERSION ("ProductVersion")
# $FV_PRIVATEBUILD ("PrivateBuild")
# $FV_SPECIALBUILD ("SpecialBuild")
# Constants are defined in FileConstants.au3.
#
# @return String The version number ("#.#.#.#" format) - or the content of the specified string field or "0.0.0.0" if no version information (or other error) or "" if string field not filled - @error flag set to 1.
#ce
Func FileGetVersion($filename, $stringname = Default)
    #native code
EndFunc

#cs
# Include and install a file with the compiled script.
#
# @param String $source The source path of the file to compile. This must be a literal string; it cannot be a variable or the result of a function call. It can be a relative path (using .\ or ..\ in the path) to the source file (.au3).
# @param String $dest The destination path of the file with trailing backslash if only the directory is defined. This can be a variable.
# @param 0|1 $flag Determines whether to overwrite files if they already exist:
# $FC_NOOVERWRITE (0) = (default) do not overwrite existing files
# $FC_OVERWRITE (1) = overwrite existing files
# Constants are defined in FileConstants.au3.
#
# @return 0|1 1 if successful, 0 on failure.
#ce
Func FileInstall($source, $dest, $flag = 0)
    #native code
EndFunc

#cs
# Moves one or more files.
#
# @param String $source The source path and filename of the file to move. (* wildcards accepted - See Remarks)
# @param String $dest The destination path and filename of the moved file. (* wildcards accepted - See Remarks)
# @param 0|1 $flag Determines whether to overwrite files if they already exist:
# $FC_NOOVERWRITE (0) = (default) do not overwrite existing files
# $FC_OVERWRITE (1) = overwrite existing files
# $FC_CREATEPATH (8) = Create destination directory structure if it doesn't exist (See Remarks).
# Constants are defined in FileConstants.au3.
#
# @return 0|1 1 if successful, 0 if source cannot be moved or if dest already exists and flag=0.
#ce
Func FileMove($source, $dest, $flag = 0)
    #native code
EndFunc

#cs
# Opens a file for reading or writing.
#
# @param String $filename The path and filename.
# @param 0|1|2 $mode Flag to indicate which mode
# $FO_READ (0) = Read mode (default)
# $FO_APPEND (1) = Write mode (append to end of file)
# $FO_OVERWRITE (2) = Write mode (erase previous contents)
# $FO_CREATEPATH (8) = Create directory structure if it doesn't exist (See Remarks).
# $FO_BINARY (16) = Force binary mode (See Remarks).
# $FO_UNICODE or $FO_UTF16_LE (32) = Use Unicode UTF16 Little Endian reading and writing mode.
# $FO_UTF16_BE (64) = Use Unicode UTF16 Big Endian reading and writing mode.
# $FO_UTF8 (128) = Use Unicode UTF8 (with BOM) reading and writing mode.
# $FO_UTF8_NOBOM (256) = Use Unicode UTF8 (without BOM) reading and writing mode.
# $FO_ANSI (512) = Use ANSI reading and writing mode.
# $FO_UTF16_LE_NOBOM (1024) = Use Unicode UTF16 Little Endian (without BOM) reading and writing mode.
# $FO_UTF16_BE_NOBOM (2048) = Use Unicode UTF16 Big Endian (without BOM) reading and writing mode.
# $FO_FULLFILE_DETECT (16384) = When opening for reading and no BOM is present, use the entire file to determine if it is UTF8 or UTF16. If this is not used then only the initial part of the file (up to 64KB) is checked for performance reasons.
# The folder path must already exist (except using $FO_CREATEPATH mode - See Remarks)
# Constants are defined in FileConstants.au3.
#
# @return Handle File "handle" for use with subsequent file functions or -1 if an error occurs.
#ce
Func FileOpen($filename, $mode = 0)
    #native code
EndFunc

#cs
# Initiates a Open File Dialog.
#
# @param String $title Title text of the Dialog GUI.
# @param String $init_dir Initial directory selected in the GUI file tree.
# @param String $filter File type single filter such as "All (*.*)" or "Text files (*.txt)" or multiple filter groups such as "All (*.*)|Text files (*.txt)" (See Remarks).
# @param Int $options Dialog Options: To use more than one option, BitOR the required values together.
# $FD_FILEMUSTEXIST (1) = File Must Exist (if user types a filename)
# $FD_PATHMUSTEXIST (2) = Path Must Exist (if user types a path, ending with a backslash)
# $FD_MULTISELECT (4) = Allow MultiSelect
# $FD_PROMPTCREATENEW (8) = Prompt to Create New File (if does not exist)
# Constants are defined in FileConstants.au3.
# @param String $default_name Suggested file name for the user to open. Default is blank ("").
# @param Hwnd $hwnd The window handle to use as the parent for this dialog.
#
# @return String The full path of the file(s) chosen. Results for multiple selections are "Directory|file1|file2|...".
#ce
Func FileOpenDialog($title, $init_dir, $filter, $options = 0, $default_name = "", $hwnd = 0)
    #native code
EndFunc

#cs
# Read in a number of characters from a previously opened file.
#
# @param Handle|String $file The handle of a file, as returned by a previous call to FileOpen(). Alternatively you may use a string filename as the first parameter.
# @param Int $count The number of characters to read.
#
# @return String|Binary The binary/string read. @extended is set to the number of bytes/characters returned.
#ce
Func FileRead($file, $count = -1)
    #native code
EndFunc

#cs
# Read in a line of text from a previously opened text file.
#
# @param Handle|String $file The handle of a file, as returned by a previous call to FileOpen(). Alternatively you may use a string filename as the first parameter.
# @param Int $line The line number to read. The first line of a text file is line 1 (not zero); the last line is -1.
#
# @return String|Binary The binary/string read. @extended is set to the number of bytes/characters returned.
#ce
Func FileReadLine($file, $line = 1)
    #native code
EndFunc

#cs
# Reads the specified file into an array.
#
# @param Handle|String $file The handle of a file, as returned by a previous call to FileOpen(). Alternatively you may use a string filename as the first parameter.
#
# @return Array A 1 dimension array containing one line of text per element and @extended set to the number of lines read.
#ce
Func FileReadToArray($file)
    #native code
EndFunc

#cs
# Sends a file or directory to the recycle bin.
#
# @param String $source The source path of the file(s) or directory to Recycle. (* and ? wildcards accepted - See Remarks)
#
# @return 0|1 1 if successful, 0 (typically meaning the file is in use or does not exist).
#ce
Func FileRecycle($source)
    #native code
EndFunc

#cs
# Empties the recycle bin.
#
# @param String $source The rootpath to empty - if omitted the recycle bin for all drives is emptied.
#
# @return 0|1 1 if successful, 0 (the recycle bin cannot be emptied).
#ce
Func FileRecycleEmpty($source = Default)
    #native code
EndFunc

#cs
# Initiates a Save File Dialog.
#
# @param String $title Title text of the Dialog GUI.
# @param String $init_dir Initial directory selected in the GUI file tree.
# @param String $filter File type single filter such as "All (*.*)" or "Text files (*.txt)" or multiple filter groups such as "All (*.*)|Text files (*.txt)" (See Remarks).
# @param Int $options Dialog Options: To use more than one option, BitOR the required values together.
# $FD_PATHMUSTEXIST (2) = Path Must Exist (if user types a path, ending with a backslash)
# $FD_PROMPTOVERWRITE (16) = Prompt to OverWrite File
# Constants are defined in FileConstants.au3.
# @param String $default_name Suggested file name for the user to save.
# @param Hwnd $hwnd The window handle to use as the parent for this dialog.
#
# @return String The full path of the file chosen. Results for multiple selections are "Directory|file1|file2|...".
#ce
Func FileSaveDialog($title, $init_dir, $filter, $options = 0, $default_name = "", $hwnd = 0)
    #native code
EndFunc

#cs
# Initiates a Browse For Folder dialog.
#
# @param String $dialog_text Title text of the Dialog GUI.
# @param String $root_dir Root directory of GUI file tree - use to limit user choice. Setting "" uses Desktop - see remarks below.
# @param Int $flag
# $FSF_CREATEBUTTON (1) = Show Create Folder Button (XP only)
# $FSF_NEWDIALOG (2) = Use New Dialog Style (XP only)
# $FSF_EDITCONTROL (4) = Show Edit Control (XP only)
# Constants are defined in FileConstants.au3.
# @param String $initial_dir The full path of the folder you selected/highlighted when displaying dialogue (if it exists in the root folder).
# @param Hwnd $hwnd The window handle to use as the parent for this dialog.
#
# @return String The full path of the folder chosen.
#ce
Func FileSelectFolder($dialog_text, $root_dir, $flag = 0, $initial_dir = "", $hwnd = 0)
    #native code
EndFunc

#cs
# Sets the attributes of one or more files/directories.
#
# @param String $file_pattern The path of the file(s) to set, e.g. C:\*.au3, C:\Dir. (* and ? wildcards accepted - See Remarks)
# @param Int $attributes Attribute(s) to set/clear. e.g. "+A", "+RA-SH"
# @param 0|1 $recurse
# $FT_NONRECURSIVE (0) - no recursion (Default)
# $FT_RECURSIVE (1) - directories are recursed into.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func FileSetAttrib($file_pattern, $attributes, $recurse = 0)
    #native code
EndFunc

#cs
# Sets the end of the file at the current file position.
#
# @param Handle $filehandle The handle of a file, as returned by a previous call to FileOpen().
#
# @return Boolean True if successful, False if not.
#ce
Func FileSetEnd($filehandle)
    #native code
EndFunc

#cs
# Sets the current file position.
#
# @param Handle $filehandle The handle of a file, as returned by a previous call to FileOpen().
# @param Int $offset The offset to move from the origin. This value may be positive or negative. Negative values move backwards from the origin.
# @param Int $origin
# $FILE_BEGIN (0) = Beginning of the file.
# $FILE_CURRENT (1) = Current position.
# $FILE_END (2) = End of the file.
# Constants are defined in FileConstants.au3.
#
# @return Boolean True if successful, False if not.
#ce
Func FileSetPos($filehandle, $offset, $origin)
    #native code
EndFunc

#cs
# Sets the timestamp of one of more files.
#
# @param String $file_pattern The path of the file(s) to set, e.g. C:\*.au3, C:\Dir. (* and ? wildcards accepted - See Remarks)
# @param Int $time The new time to set in the format "YYYYMMDDHHMMSS" (Year, month, day, hours (24hr clock), seconds). If the time is blank "" then the current time is used.
# @param 0|1 $type The timestamp to change:
# $FT_MODIFIED (0) = Last modified (default)
# $FT_CREATED (1) = Created
# $FT_ACCESSED (2) = Last accessed
# Constants are defined in FileConstants.au3
# @param 0|1 $recurse
# $FT_NONRECURSIVE (0) - no recursion (Default).
# $FT_RECURSIVE (1) - directories are recursed into.
# Constants are defined in FileConstants.au3
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func FileSetTime($file_pattern, $time, $type = 0, $recurse = 0)
    #native code
EndFunc

#cs
# Write text/data to the end of a previously opened file.
#
# @param Handle|String $file The handle of a file, as returned by a previous call to FileOpen(). Alternatively, you may use a string filename as the first parameter.
# @param String|Binary $data The text/data to write to the file. The text is written as is - no @CR or @LF characters are added. See remark for data type.
#
# @return 0|1 1 if successful, 0 if file not opened in writemode, file is read only, or file cannot otherwise be written to.
#ce
Func FileWrite($file, $data)
    #native code
EndFunc

#cs
# Append a line of text to the end of a previously opened text file.
#
# @param Handle|String $file The handle of a file, as returned by a previous call to FileOpen(). Alternatively, you may use a string filename as the first parameter.
# @param String $line  	The line of text to write to the text file. If the line does NOT end in @CR or @LF then a DOS linefeed (@CRLF) will be automatically added.
#
# @return 0|1 1 if successful, 0 if file not opened in writemode, file is read only, or file cannot otherwise be written to.
#ce
Func FileWriteLine($file, $line)
    #native code
EndFunc

#cs
# Returns a number rounded down to the closest integer.
#
# @param Number $expression Any valid numeric expression.
#
# @return Int Returns the rounded number.
#ce
Func Floor($expression)
    #native code
EndFunc

#cs
# Sets the internet proxy to use for ftp access.
#
# @param 0|1|2 $mode The proxy mode to use:
# $PROXY_IE (0) = (default) Use current Internet Explorer settings for proxy.
# $PROXY_NONE (1) = Use no proxy (direct access)
# $PROXY_SPECIFIED (2) = Use the proxy specified
# Constants are deined in "AutoItConstants.au3".
# @param String $address The address and port of the proxy to use. See remarks below.
# @param String $username If required, the username for the proxy
# @param String $password If required, the password for the proxy
#
# @return Void
#ce
Func FtpSetProxy($mode = 0, $address = Default, $username = Default, $password = Default)
    #native code
EndFunc

#cs
# Returns the name of a function stored in a variable.
#
# @param String|Function $Functionvariable A variable containing a Function whose name you want to retrieve.
#
# @return String The name of the function
#ce
Func FuncName($Functionvariable)
    #native code
EndFunc

#cs
# Create a GUI window.
#
# @param String $title The title of the dialog box.
# @param Int $width The width of the client area of the window.
# @param Int $height The height of the client area of the window.
# @param Int $left The left side of the dialog box. By default (-1), the window is centered. If defined, top must also be defined.
# @param Int $top The top of the dialog box. Default (-1) is centered
# @param Int $style defines the style of the window. See GUI Control Styles Appendix.
# Use -1 for the default style which includes a combination of $WS_MINIMIZEBOX, $WS_CAPTION, $WS_POPUP, $WS_SYSMENU styles.
# Some styles are always included: $WS_CLIPSIBLINGS, and $WS_SYSMENU if $WS_MAXIMIZEBOX or $WS_SIZEBOX is specified.
# @param Int $exStyle defines the extended style of the window. See the Extended Style Table below.
# Use -1 for the default, which is no extended styles.
# Forced styles: $WS_EX_WINDOWEDGE
# @param Int $parent The handle of another previously created window - this new window then becomes a child of that window.
#
# @return Handle a windows handle or 0 if the window cannot be created and sets the @error flag to 1.
#ce
Func GUICreate($title, $width = Default, $height = Default, $left = -1, $top = -1, $style = -1, $exStyle = -1, $parent = 0)
    #native code
EndFunc

#cs
# Creates an AVI video control for the GUI.
#
# @param String $filename The filename of the video. Only .avi files are supported.
# @param Int $subfileid id of the subfile to be used. If the file only contains one video then use 0.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default (-1) : $ACS_TRANSPARENT
# $ACS_TRANSPARENT is always used unless $ACS_NONTRANSPARENT is specified.
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateAvi($filename, $subfileid, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a Button control for the GUI.
#
# @param String $text The text of the button control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : none.
# forced styles : $WS_TABSTOP
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
# default ( -1) : WS_EX_WINDOWEDGE
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateButton($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a Checkbox control for the GUI.
#
# @param String $text The text of the checkbox control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : $BS_AUTOCHECKBOX.
# forced styles : $WS_TABSTOP, and $BS_AUTOCHECKBOX if no checkbox style defined.
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateCheckbox($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a ComboBox control for the GUI.
#
# @param String $text The text of the combobox control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default (-1) : $CBS_DROPDOWN, $CBS_AUTOHSCROLL, $WS_VSCROLL
# forced style : $WS_TABSTOP
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
# default ( -1) : $WS_EX_CLIENTEDGE
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateCombo($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a context menu for a control or entire GUI window.
#
# @param Int $controlID Control identifier as returned by a GUICtrlCreate...() function.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateContextMenu($controlID)
    #native code
EndFunc

#cs
# Creates a date control for the GUI.
#
# @param String $text The preselected date (always as "yyyy/mm/dd").
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default (-1) : $DTS_LONGDATEFORMAT
# forced style : $WS_TABSTOP
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
# default (-1) : WS_EX_CLIENTEDGE
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateDate($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a Dummy control for the GUI.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateDummy()
    #native code
EndFunc

#cs
# Creates an Edit control for the GUI.
#
# @param String $text The text of the edit control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : $ES_WANTRETURN, $WS_VSCROLL, $WS_HSCROLL, $ES_AUTOVSCROLL, $ES_AUTOHSCROLL
# forced styles : $ES_MULTILINE, $WS_TABSTOP only if not $ES_READONLY
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
# default (-1) : $WS_EX_CLIENTEDGE
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateEdit($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a Graphic control for the GUI.
#
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : $SS_NOTIFY.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateGraphic($left, $top, $width = Default, $height = Default, $style = Default)
    #native code
EndFunc

#cs
# Creates a Group control for the GUI.
#
# @param String $text The text of the group control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : none.
# forced styles : $WS_GROUP, $BS_GROUPBOX.
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateGroup($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates an Icon control for the GUI.
#
# @param String $filename The filename of the icon to be loaded.
# @param String $iconName Icon name if the file contains multiple icons. Can be an ordinal name if negative number. Otherwise -1.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is 32).
# @param Int $height The width of the control (default is 32).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : $SS_NOTIFY
# forced styles : $WS_TABSTOP, $SS_ICON
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateIcon($filename, $iconName, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates an Input control for the GUI.
#
# @param String $text The text of the input control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : $ES_LEFT, $ES_AUTOHSCROLL
# forced styles : $WS_TABSTOP only if no $ES_READONLY. $ES_MULTILINE is always reset.
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
# default ( -1) : $WS_EX_CLIENTEDGE
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateInput($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a static Label control for the GUI.
#
# @param String $text The text of the label control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : none.
# forced styles : $SS_NOTIFY, $SS_LEFT
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateLabel($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a List control for the GUI.
#
# @param String $text The text of the list control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : $LBS_SORT, $WS_BORDER, $WS_VSCROLL
# forced styles : $WS_TABSTOP, $LBS_NOTIFY
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
# default ( -1) : $WS_EX_CLIENTEDGE
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateList($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a ListView control for the GUI.
#
# @param String $text The text of the list control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default (-1) : $LVS_SHOWSELALWAYS, $LVS_SINGLESEL
# forced style : $LVS_REPORT
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table or ListView Extended Style Table.
# default (-1) : $LVS_EX_FULLROWSELECT, $WS_EX_CLIENTEDGE
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateListView($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a ListView item.
#
# @param String $text subitemtext separated with Opt("GUIDataSeparatorChar").
# @param Int $listviewID The controlID of the ListView control holding the item.
#
# @return Int The identifier (itemID) of the new item or 0 on failure.
#ce
Func GUICtrlCreateListViewItem($text, $listviewID)
    #native code
EndFunc

#cs
# Creates a Menu control for the GUI.
#
# @param String $submenutext The submenu text.
# @param Int $menuID If defined, allows you to create a submenu in the referenced menu. If equal -1 it refers to first level menu.
# @param Int $menuentry Allows you to define the entry number to be created. The entries are numbered starting at 0.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateMenu($submenutext, $menuID = -1, $menuentry = -1)
    #native code
EndFunc

#cs
# Creates a MenuItem control for the GUI.
#
# @param String $text The text of the menu item.
# @param Int $menuID Allows you to create a submenu in the referenced menu. If equal -1 it refers to the first level menu.
# @param Int $menuentry Allows you to define the entry number to be created. The entries are numbered starting at 0.
# @param Int $menuradioitem 0 (default) = create a normal menuitem, 1 = create a menuradioitem
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateMenuItem($text, $menuID, $menuentry = -1, $menuradioitem = 0)
    #native code
EndFunc

#cs
# Creates a month calendar control for the GUI.
#
# @param String $text The preselected date (always as "yyyy/mm/dd").
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default (-1) : none.
# forced style : $WS_TABSTOP
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
# default (-1) : $WS_EX_CLIENTEDGE
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateMonthCal($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates an ActiveX control in the GUI.
#
# @param String $ObjectVar A variable pointing to a previously opened object
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateObj($ObjectVar, $left, $top, $width = Default, $height = Default)
    #native code
EndFunc

#cs
# Creates a Picture control for the GUI.
#
# @param String $filename The  	filename of the picture to be loaded : supported types BMP, JPG, GIF(but not animated).
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default (-1) : $SS_NOTIFY
# forced style : $SS_BITMAP | $SS_CENTERIMAGE
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreatePic($filename, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a Progress control for the GUI.
#
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateProgress($left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a Radio button control for the GUI.
#
# @param String $text The text of the button control.
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default text autofit in width).
# @param Int $height The height of the control (default text autofit in height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : none.
# forced styles : $BS_AUTORADIOBUTTON and $WS_TABSTOP if first radio in the group.
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateRadio($text, $left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a Slider control for the GUI.
#
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default (-1) : $TBS_AUTOTICKS
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateSlider($left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a Tab control for the GUI.
#
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default ( -1) : none.
# forced styles : $TCS_TOOLTIPS, $WS_TABSTOP, $WS_CLIPSIBLINGS
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateTab($left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a TabItem control within an existing tab control in the GUI.
#
# @param String $text The text of the TabItem control.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateTabItem($text)
    #native code
EndFunc

#cs
# Creates a TreeView control for the GUI.
#
# @param Int $left The left side of the control. If -1 is used then left will be computed according to GUICoordMode.
# @param Int $top The top of the control. If -1 is used then top will be computed according to GUICoordMode.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default (-1) : $TVS_HASBUTTONS, $TVS_HASLINES, $TVS_LINESATROOT, $TVS_DISABLEDRAGDROP, $TVS_SHOWSELALWAYS
# forced style : $WS_TABSTOP
# @param Int $exStyle Defines the extended style of the control. See Extended Style Table.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateTreeView($left, $top, $width = Default, $height = Default, $style = -1, $exStyle = -1)
    #native code
EndFunc

#cs
# Creates a TreeViewItem control for the GUI.
#
# @param String $text The text of the TreeViewItem control.
# @param Int $treeviewID The treeview identifier as return by treeview or treeviewitem creation if subtree is created.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateTreeViewItem($text, $treeviewID)
    #native code
EndFunc

#cs
# Creates an UpDown control for the GUI.
#
# @param Int $inputcontrolID The controlID of the input control in which the updown control will be created, or -1 for the last created control.
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# default (-1) : $GUI_SS_DEFAULT_UPDOWN.
# forced style : $UDS_SETBUDDYINT and $UDS_ALIGNRIGHT if no align defined.
#
# @return Int The identifier (controlID) of the new control or 0 on failure.
#ce
Func GUICtrlCreateUpDown($inputcontrolID, $style = -1)
    #native code
EndFunc

#cs
# Deletes a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlDestroy($controlID)
    #native code
EndFunc

#cs
# Returns the handle for a control and some special (item) handles (Menu, ContextMenu, TreeViewItem).
#
# @param String $controlID The control identifier as returned by a GUICtrlCreate...() function.
#
# @return Int The handle of the control.
#ce
Func GUICtrlGetHandle($controlID)
    #native code
EndFunc

#cs
# Gets the current state of a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
#
# @return Int The state of the control. See GUICtrlSetState() for values. -1 if control is not defined.
#ce
Func GUICtrlGetState($controlID)
    #native code
EndFunc

#cs
# Read state or data of a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int Extended information of a control.
# $GUI_READ_DEFAULT (0) = (Default) Returns a value with state or data of a control.
# $GUI_READ_EXTENDED (1) = Returns extended information of a control (see Remarks).
# Constants are defined in GUIConstantsEx.au3.
#
# @return Mixed The data or state of the control.
#ce
Func GUICtrlRead($controlID, $advanced = 0)
    #native code
EndFunc

#cs
# Send a message to a control and retrieve information in lParam.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $msg The type of message to be send to the control as defined in the Windows controls documentation.
# @param Int $wParam An integer first param to be send to the control.
# @param Int $lParamType Define the type of lParam that will be returned: 0 (default) for wParam and lParam, 1 for lParam String, 2 for lParam RECT struct.
#
# @return Mixed The value returned by the SendMessage Windows API.
#ce
Func GUICtrlRecvMsg($controlID, $msg, $wParam, $lParamType)
    #native code
EndFunc

#cs
# Register a user defined function for an internal listview sorting callback function.
#
# @param String $controlID The listview controlID for which the user function should proceed.
# @param String $function The name of the user function to call when the sorting callback runs.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlRegisterListViewSort($controlID, $function)
    #native code
EndFunc

#cs
# Send a message to a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $msg The type of message to be send to the control as defined in the Windows controls documentation.
# @param Int $wParam The first param to be send to the control.
# @param Int $lParam The second param to be send to the control.
#
# @return Mixed The value returned by the SendMessage Windows API.
#ce
Func GUICtrlSendMsg($controlID, $msg, $wParam, $lParam)
    #native code
EndFunc

#cs
# Sends a message to a Dummy control.
#
# @param String $controlID The control identifier (controlID) as returned by GUICtrlCreateDummy()
# @param Mixed $state The value that can be retrieved later on by GUICtrlRead()
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSendToDummy($controlID, $state)
    #native code
EndFunc

#cs
# Sets the background color of a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $backgroundcolor The RGB color to use.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetBkColor($controlID, $backgroundcolor)
    #native code
EndFunc

#cs
# Sets the text color of a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $textcolor The RGB color to use.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetColor($controlID, $textcolor)
    #native code
EndFunc

#cs
# Sets the mouse cursor icon for a particular control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $cursorID The cursor ID as used by Windows SetCursor API (use -1 for the default mouse cursor for the control)
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetCursor($controlID, $cursorID)
    #native code
EndFunc

#cs
# Modifies the data for a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Mixed $data Combo, List, ListView, ListViewItem: An Opt("GUIDataSeparatorChar",...) separated list of items.
# Progress: The percentage.
# Slider: The value.
# Button, Checkbox, Combo, Edit, Group, Input, Label, List, Menu, MenuItem, Radio, TabItem, TreeViewItem: Replaces the text.
# Date : The date or time depending the style of the control and the regional settings.
# Dummy: The value.
# @param Mixed $default
# Combo, List: The default value.
# Edit, Input: If non-empty (""), the string is inserted at the current insertion point (caret).
#
# @return -1|0|1 1 if successful, 0 if not, -1 in case of invalid data.
#ce
Func GUICtrlSetData($controlID, $data, $default = Default)
    #native code
EndFunc

#cs
# Sets the default background color of all the controls of the GUI window.
#
# @param Int $defbkcolor Default background color for all controls.
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetDefBkColor($defbkcolor, $winhandle = Default)
    #native code
EndFunc

#cs
# Sets the default text color of all the controls of the GUI window.
#
# @param Int $deftextcolor Default text color for all controls.
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetDefColor($deftextcolor, $winhandle = Default)
    #native code
EndFunc

#cs
# Sets the font for a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $size Fontsize (default is 8.5).
# @param Int $weight The weight of the font in the range 0 through 1000. For example, 400 is normal and 700 is bold. If this value is zero, a default weight is used.
# The following values are defined for convenience.
# $FW_DONTCARE = 0 (Use the default font weight)
# $FW_THIN = 100
# $FW_EXTRALIGHT = 200
# $FW_LIGHT = 300
# $FW_NORMAL = 400
# $FW_MEDIUM = 500
# $FW_SEMIBOLD = 600
# $FW_BOLD = 700
# $FW_EXTRABOLD = 800
# $FW_HEAVY = 900
# Constants are defined in FontConstants.au3.
# @param Int $attribute Font attributes, which can be a combination of the following added together:
# $GUI_FONTNORMAL (0) = Normal
# $GUI_FONTITALIC (2) = Italic
# $GUI_FONTUNDER (4) = Underlined
# $GUI_FONTSTRIKE (8) = Strike
# Constants are defined in GUIConstantsEx.au3.
# @param String $fontname Name of the font to use. (OS default GUI font is used if the font is "" or is not found).
# @param Int $quality Font quality to select. The following qualities are accepted:
# $DEFAULT_QUALITY (0) = Appearance of the font does not matter.
# $DRAFT_QUALITY (1) = Appearance of the font is less important than when $PROOF_QUALITY is used. For GDI raster fonts, scaling is enabled, which means that more font sizes are available, but the quality may be lower. Bold, italic, underline, and strikeout fonts are synthesized if necessary.
# $PROOF_QUALITY (2) = (default) Character quality of the font is more important than exact matching of the logical-font attributes. For GDI raster fonts, scaling is disabled and the font closest in size is chosen. Although the chosen font size may not be mapped exactly when $PROOF_QUALITY is used, the quality of the font is high and there is no distortion of appearance. Bold, italic, underline, and strikeout fonts are synthesized if necessary.
# $NONANTIALIASED_QUALITY (3) = Font is never antialiased.
# $ANTIALIASED_QUALITY (4) = Font is always antialiased if the font supports it and the size of the font is not too small or too large.
# $CLEARTYPE_QUALITY (5) = If set, text is rendered (when possible) using ClearType antialiasing method. See the remarks on the msdn page for LOGFONT for details about when cleartype is not available.
# If neither $ANTIALIASED_QUALITY nor $NONANTIALIASED_QUALITY is selected, the font is antialiased only if the user chooses smooth screen fonts in Control Panel.
# Constants are defined in FontConstants.au3
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetFont($controlID, $size, $weight = Default, $attribute = Default, $fontname = Default, $quality = Default)
    #native code
EndFunc

#cs
# Modifies the data for a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreateGraphic() function.
# @param Mixed $type type of drawing : dot, line, bezier, rect, ellipse, pie.
# @param Int $par1
# @param Int $par2
# @param Int $par3
# @param Int $par4
# @param Int $par5
# @param Int $par6
#
# @return -1|0|1 1 if successful, 0 if not, -1 in case of invalid data.
#ce
Func GUICtrlSetGraphic($controlID, $type, $par1 = Default, $par2 = Default, $par3 = Default, $par4 = Default, $par5 = Default, $par6 = Default)
    #native code
EndFunc

#cs
# Sets the bitmap or icon image to use for a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param String $filename The filename containing the picture to be display on the control.
# @param String $iconname The icon name if the file contains multiple icons. Can be an ordinal name if negative number. Otherwise -1.
# @param Int $icontype To select a specific icon size : 0 = small, 1 = normal (default).
# For a TreeViewItem the icon size : 2 = selected, 4 for non-selected item.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetImage($controlID, $filename, $iconname = Default, $icontype = Default)
    #native code
EndFunc

#cs
# Limits the number of characters/pixels for a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $max For List controls it is the extent you can scroll horizontally in pixels.
# For Input/Edit controls it is the max number of characters that can be entered.
# @param Int $min For Slider and UpDown controls you can specify a min value. Default = 0
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetLimit($controlID, $max, $min = 0)
    #native code
EndFunc

#cs
# Defines a user-defined function to be called when a control is clicked.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param String $function The name of the user function to call.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetOnEvent($controlID, $function)
    #native code
EndFunc

#cs
# Changes the position of a control within the GUI window.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $left The left side of the control.
# @param Int $top The top of the control.
# @param Int $width The width of the control.
# @param Int $height The height of the control.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetPos($controlID, $left, $top = Default, $width = Default, $height = Default)
    #native code
EndFunc

#cs
# Defines the resizing method used by a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $resizing See the Docking Values table for values that can be used (add together multiple values if required).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetResizing($controlID, $resizing)
    #native code
EndFunc

#cs
# Changes the state of a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $state See the State table.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetState($controlID, $state)
    #native code
EndFunc

#cs
# Changes the style of a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param Int $style Defines the style of the control. See GUI Control Styles Appendix.
# @param Int $exStyle Defines the extended Style of the control. See Extended Style Table.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetStyle($controlID, $style, $exStyle = Default)
    #native code
EndFunc

#cs
# Sets the tip text associated with a control.
#
# @param String $controlID The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.
# @param String $tiptext Tip text that will be displayed when the mouse is hovered over the control.
# @param String $title The title for the tooltip.
# @param Int $icon Pre-defined icon to show next to the title: requires a title.
# $TIP_NOICON (0) = No icon
# $TIP_INFOICON (1) = Info icon
# $TIP_WARNINGICON (2) = Warning icon
# $TIP_ERRORICON (3) = Error Icon
# Constants are defined in "AutoItConstants.au3".
# @param Int $options Sets different options for how the tooltip will be displayed (Can be added together):
# $TIP_BALLOON (1) = Display as Balloon Tip.
# $TIP_CENTER (2) = Center the tip horizontally along the control.
# Constants are defined in "AutoItConstants.au3".
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUICtrlSetTip($controlID, $tiptext, $title = Default, $icon = Default, $options = Default)
    #native code
EndFunc

#cs
# Deletes a GUI window and all controls that it contains.
#
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUIDelete($winhandle = Default)
    #native code
EndFunc

#cs
# Gets the mouse cursor position relative to GUI window.
#
# @param Int $winhandle The handle of the window to use. If omitted the "current" window will be used.
#
# @return Array A five-element array that containing the mouse cursor information:
# $aArray[0] = X coord (horizontal)
# $aArray[1] = Y coord (vertical)
# $aArray[2] = Primary down (1 if pressed, 0 if not pressed)
# $aArray[3] = Secondary down (1 if pressed, 0 if not pressed)
# $aArray[4] = ID of the control that the mouse cursor is hovering over (or 0 if none)
#ce
Func GUIGetCursorInfo($winhandle = Default)
    #native code
EndFunc

#cs
# Polls the GUI to see if any events have occurred.
#
# @param Int $advanced return extended information in an array.
# $GUI_EVENT_SINGLE (0) = (default) Returns a single event.
# $GUI_EVENT_ARRAY (1) = returns an array containing the event and extended information.
# Constants are defined in GUIConstantsEx.au3.
#
# @return Int|Array Returns an event, or an array depending on the "advanced" parameter.
#ce
Func GUIGetMsg($advanced = 0)
    #native code
EndFunc

#cs
# Retrieves the styles of a GUI window.
#
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return Array A two-element array that containing the styles information:
# $aArray[0] = Style
# $aArray[1] = ExStyle
#ce
Func GUIGetStyle($winhandle = Default)
    #native code
EndFunc

#cs
# Register a user defined function for a known Windows Message ID (WM_MSG).
#
# @param Int $msgID A Windows Message ID (see Appendix: Windows Message Codes).
# @param String $function The name of the user function to call when the message appears or an empty string "" to unregister a message.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUIRegisterMsg($msgID, $function)
    #native code
EndFunc

#cs
# Sets the accelerator table to be used in a GUI window.
#
# @param String $accelerators  	A 2 dimensional array holding the accelerator table (See remarks).
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUISetAccelerators($accelerators, $winhandle = Default)
    #native code
EndFunc

#cs
# Sets the background color of the GUI window.
#
# @param Int $background Background color of the dialog box, in RGB Hex format.
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUISetBkColor($background, $winhandle = Default)
    #native code
EndFunc

#cs
# Sets absolute coordinates for the next control.
#
# @param Int $left The left side of the control.
# @param Int $top The top of the control.
# @param Int $width The width of the control (default is the previously used width).
# @param Int $height The height of the control (default is the previously used height).
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUISetCoord($left, $top, $width = Default, $height = Default, $winhandle = Default)
    #native code
EndFunc

#cs
# Sets the mouse cursor icon for a GUI window.
#
# @param Int $cursorID Cursor Id (See Remarks).
# @param Int $override Force the requested mouse cursor even when over controls (see below).
# $GUI_CURSOR_NOOVERRIDE (0) = (default) Don't override a control's default mouse cursor.
# $GUI_CURSOR_OVERRIDE (1) = override control's default mouse cursor.
# Constants are defined in GUIConstantsEx.au3.
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return Void
#ce
Func GUISetCursor($cursorID, $override = 0, $winhandle = Default)
    #native code
EndFunc

#cs
# Sets the default font for a GUI window.
#
# @param Int $size Fontsize (default is 8.5).
# @param Int $weight The weight of the font in the range 0 through 1000. For example, 400 is normal and 700 is bold. If this value is zero, a default weight is used.
# The following values are defined for convenience.
# $FW_DONTCARE = 0 (Use the default font weight)
# $FW_THIN = 100
# $FW_EXTRALIGHT = 200
# $FW_LIGHT = 300
# $FW_NORMAL = 400
# $FW_MEDIUM = 500
# $FW_SEMIBOLD = 600
# $FW_BOLD = 700
# $FW_EXTRABOLD = 800
# $FW_HEAVY = 900
# Constants are defined in FontConstants.au3.
# @param Int $attribute Font attributes, which can be a combination of the following added together:
# $GUI_FONTNORMAL (0) = Normal (Default)
# $GUI_FONTITALIC (2) = Italic
# $GUI_FONTUNDER (4) = Underlined
# $GUI_FONTSTRIKE (8) = Strike
# Constants are defined in GUIConstantsEx.au3.
# @param String $fontname Font to use. (OS default GUI font is used if the font is "" or is not found).
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
# @param Int $quality Font quality to select. The following qualities are accepted:
# $DEFAULT_QUALITY (0) = Appearance of the font does not matter (Default).
# $DRAFT_QUALITY (1) = Appearance of the font is less important than when $PROOF_QUALITY is used. For GDI raster fonts, scaling is enabled, which means that more font sizes are available, but the quality may be lower. Bold, italic, underline, and strikeout fonts are synthesized if necessary.
# $PROOF_QUALITY (2) = (default) Character quality of the font is more important than exact matching of the logical-font attributes. For GDI raster fonts, scaling is disabled and the font closest in size is chosen. Although the chosen font size may not be mapped exactly when $PROOF_QUALITY is used, the quality of the font is high and there is no distortion of appearance. Bold, italic, underline, and strikeout fonts are synthesized if necessary.
# $NONANTIALIASED_QUALITY (3) = Font is never anti aliased.
# $ANTIALIASED_QUALITY (4) = Font is always anti aliased if the font supports it and the size of the font is not too small or too large.
# $CLEARTYPE_QUALITY (5) = If set, text is rendered (when possible) using ClearType anti aliasing method. See the remarks on the MSDN page for LOGFONT for details about when ClearType is not available.
# If neither $ANTIALIASED_QUALITY nor $NONANTIALIASED_QUALITY is selected, the font is anti aliased only if the user chooses smooth screen fonts in Control Panel.
# Constants are defined in FontConstants.au3
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUISetFont($size, $weight = Default, $attribute = Default, $fontname = Default, $winhandle = Default, $quality = Default)
    #native code
EndFunc

#cs
# Sets an executable file that will be run when F1 is pressed.
#
# @param String $helpfile The file that will be run if F1 is pressed when the GUI is active.
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUISetHelp($helpfile, $winhandle = Default)
    #native code
EndFunc

#cs
# Sets the icon used in a GUI window.
#
# @param String $iconfile Used to display the icon in the title area.
# @param Int $iconID The ID of the icon in the iconfile.
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUISetIcon($iconfile, $iconID = -1, $winhandle = Default)
    #native code
EndFunc

#cs
# Defines a user function to be called when a system button is clicked.
#
# @param Int $specialID See the Special ID table.
# @param String $function The name of the user function to call.
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUISetOnEvent($specialID, $function, $winhandle = Default)
    #native code
EndFunc

#cs
# Changes the state of a GUI window.
#
# @param Int $flag @SW_SHOW = Shows a previously hidden window (default)
# @SW_HIDE = Hide window
# @SW_MINIMIZE = Minimize window
# @SW_MAXIMIZE = Maximize window
# @SW_RESTORE = Undoes a window minimization
# @SW_DISABLE = Disables the window
# @SW_ENABLE = Enables the window
# @SW_LOCK = Lock the window to avoid repainting.
# @SW_UNLOCK = Unlock windows to allow painting.
# @SW_SHOWDEFAULT - Sets the show state based on the SW_ flag specified in the STARTUPINFO structure
# @SW_SHOWMAXIMIZED - Activates the window and displays it as a maximized window
# @SW_SHOWMINIMIZED - Activates the window and displays it as a minimized window
# @SW_SHOWMINNOACTIVE - Displays the window as a minimized window
# @SW_SHOWNA - Displays the window in its current state
# @SW_SHOWNOACTIVATE - Displays a window in its most recent size and position
# @SW_SHOWNORMAL - Activates and displays a window
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUISetState($flag = @SW_SHOW, $winhandle = Default)
    #native code
EndFunc

#cs
# Changes the styles of a GUI window.
#
# @param Int $Style Defines the style of the window. See GUI Control Styles Appendix.
# Use -1 to leave it unchanged.
# @param Int $ExStyle Defines the extended style of the window. See the Extended Style Table. -1 is the default.
# Use -1 to leave it unchanged.
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUISetStyle($Style, $ExStyle = -1, $winhandle = Default)
    #native code
EndFunc

#cs
# Defines that any subsequent controls that are created will be "grouped" together.
#
# @param Int $winhandle Windows handle as returned by GUICreate() (default is the previously used window).
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func GUIStartGroup($winhandle = Default)
    #native code
EndFunc

#cs
# Switches the current window used for GUI functions.
#
# @param Int $winhandle The handle of the window to switch to.
# @param Int $tabitemID ControlID of the tabitem control to be selected.
#
# @return Handle Handle of the previous GUI or a null handle on failure.
#ce
Func GUISwitch($winhandle = Default, $tabitemID = Default)
    #native code
EndFunc

#cs
# Returns a string representation of an integer or of a binary type converted to hexadecimal.
#
# @param Int|Binary $expression The expression to convert.
# @param Int $length Number of characters to be returned for integer.
# Characters are truncated from the left-hand side if length is too small.
# This parameter is ignored if the data is binary data.
#
# @return String a string of length (never more than 16) characters, zero-padded if necessary for integer. Returns the binary type converted or empty string if length is less than 1.
#ce
Func Hex($expression, $length = Default)
    #native code
EndFunc

#cs
# Sets a hotkey that calls a user function.
#
# @param Int $key The key combination to use as the hotkey. Same format as Send(). See remarks.
# @param String $function The name of the function to call when the key is pressed. Not specifying this parameter will unset a previous hotkey.
#
# @return 0|1 1 if successful, 0 if not.
#ce
Func HotKeySet($key, $function)
    #native code
EndFunc

#cs
# Sets the internet proxy to use for http access.
#
# @param 0|1|2 $mode The proxy mode to use:
# $PROXY_IE (0) = (default) Use current Internet Explorer settings for proxy.
# $PROXY_NONE (1) = Use no proxy (direct access)
# $PROXY_SPECIFIED (2) = Use the proxy specified
# Constants are deined in "AutoItConstants.au3".
# @param String $address The address and port of the proxy to use. See remarks.
# @param String $username If required, the username for the proxy
# @param String $password If required, the password for the proxy
#
# @return Void
#ce
Func HttpSetProxy($mode, $address = "", $username = "", $password = "")
    #native code
EndFunc

#cs
# Sets the HTTP user-agent string which is sent with all Inet requests.
#
# @param String $useragent The string to set as the user-agent. The default user-agent is "AutoIt". Passing an empty string will reset the user-agent back to the default.
#
# @return String The previous user agent.
#ce
Func HttpSetUserAgent($useragent)
    #native code
EndFunc

#cs
# Converts an expression into an HWND handle.
#
# @param Any $expression An expression to convert into an HWND handle.
#
# @return Handle If the value can be converted to an HWND, the HWND representation will be returned. On failure, If the HWND does not denote a valid window, a 0 (NULL) HWND will be returned and sets the @error flag to 1.
#ce
Func HWnd($expression)
    #native code
EndFunc

#cs
# Closes a handle returned from InetGet().
#
# @param Handle $handle The handle to close.
#
# @return Boolean True if the handle was found and closed, False if not.
#ce
Func InetClose($handle)
    #native code
EndFunc

#cs
# Downloads a file from the internet using the HTTP, HTTPS or FTP protocol.
#
# @param String $URL The URL of the file to download.
# @param String $filename Local filename to download to.
# @param Int $options $INET_LOCALCACHE (0) = Get the file from local cache if available (default).
# $INET_FORCERELOAD (1) = Forces a reload from the remote site.
# $INET_IGNORESSL (2) = Ignore all SSL errors (with HTTPS connections).
# $INET_ASCIITRANSFER (4) = Use ASCII when transferring files with the FTP protocol (Can not be combined with flag $INET_BINARYTRANSFER (8)).
# $INET_BINARYTRANSFER (8) = Use BINARY when transferring files with the FTP protocol (Can not be combined with flag $INET_ASCIITRANSFER (4)). This is the default transfer mode if none are provided.
# $INET_FORCEBYPASS (16) = By-pass forcing the connection online (See remarks).
# Constants are defined in InetConstants.au3.
# @param 0|1 $background $INET_DOWNLOADWAIT (0) = Wait until the download is complete before continuing (default).
# $INET_DOWNLOADBACKGROUND (1) = return immediately and download in the background (see remarks).
# Constants are defined in InetConstants.au3
#
# @return Handle|Int the return value changes depending on if the download is in the background:
# Background: a handle is returned.
# Wait: the number of bytes downloaded.
#ce
Func InetGet($URL, $filename, $options = 0, $background = 0)
    #native code
EndFunc

#cs
# Returns detailed data for a handle returned from InetGet().
#
# @param Handle $handle A handle return from InetGet().
# @param Int $index The index for the data to retrieve. If this value is -1 an array containing all of the below data will be returned.
# $INET_DOWNLOADREAD (0) - Bytes read so far (this is updated while the download progresses).
# $INET_DOWNLOADSIZE (1) - The size of the download in bytes (this may not always be present).
# $INET_DOWNLOADCOMPLETE (2) - Set to True if the download is complete, False if the download is still ongoing.
# $INET_DOWNLOADSUCCESS (3) - True if the download was successful. If this is False then the next data member will be non-zero.
# $INET_DOWNLOADERROR (4) - The error value for the download. The value itself is arbitrary. Testing that the value is non-zero is sufficient for determining if an error occurred.
# $INET_DOWNLOADEXTENDED (5) - The extended value for the download. The value is arbitrary and is primarily only useful to the AutoIt developers.
# Constants are defined in InetConstants.au3.
#
# @return Array|Int|Boolean The request data.
#ce
Func InetGetInfo($handle = Default, $index = -1)
    #native code
EndFunc

#cs
# Returns the size (in bytes) of a file located on the internet.
#
# @param String $URL The URL of the file to get the size of.
# @param Int $options $INET_LOCALCACHE (0) = Get the file from local cache if available (default).
# $INET_FORCERELOAD (1) = Forces a reload from the remote site.
# $INET_IGNORESSL (2) = Ignore all SSL errors (with HTTPS connections).
# $INET_ASCIITRANSFER (4) = Use ASCII when transferring files with the FTP protocol (Can not be combined with flag $INET_BINARYTRANSFER (8)).
# $INET_BINARYTRANSFER (8) = Use BINARY when transferring files with the FTP protocol (Can not be combined with flag $INET_ASCIITRANSFER (4)). This is the default transfer mode if none are provided.
# Constants are defined in InetConstants.au3.
#
# @return Int The size of the file in bytes.
#ce
Func InetGetSize($URL, $options = 0)
    #native code
EndFunc

#cs
# Downloads a file from the internet using the HTTP, HTTPS or FTP protocol.
#
# @param String $URL The URL of the file to download.
# @param Int $options $INET_LOCALCACHE (0) = Get the file from local cache if available (default).
# $INET_FORCERELOAD (1) = Forces a reload from the remote site.
# $INET_IGNORESSL (2) = Ignore all SSL errors (with HTTPS connections).
# $INET_ASCIITRANSFER (4) = Use ASCII when transferring files with the FTP protocol (Can not be combined with flag $INET_BINARYTRANSFER (8)).
# $INET_BINARYTRANSFER (8) = Use BINARY when transferring files with the FTP protocol (Can not be combined with flag $INET_ASCIITRANSFER (4)). This is the default transfer mode if none are provided.
# $INET_FORCEBYPASS (16) = By-pass forcing the connection online (See remarks).
# Constants are defined in InetConstants.au3.
#
# @return Binary|String A binary string and @extended set to the number of bytes downloaded or empty string and sets the @error flag to non-zero on failure.
#ce
Func InetRead($URL, $options = 0)
    #native code
EndFunc

#cs
# Deletes a value from a standard format .ini file.
#
# @param String $filename The filename of the .ini file.
# @param String $section The section name in the .ini file.
# @param String $key The key name in the .ini file to delete. If the key name is not given the entire section is deleted. The Default keyword may also be used which will cause the section to be deleted.
#
# @return 0|1 1 if successful, 0 if the INI file does not exist or if the file is read-only.
#ce
Func IniDelete($filename, $section, $key = Default)
    #native code
EndFunc

#cs
# Reads a value from a standard format .ini file.
#
# @param String $filename The filename of the .ini file.
# @param String $section The section name in the .ini file.
# @param String $key The key name in the .ini file.
# @param String $default The default value to return if the key is not found.
#
# @return String The value of the key or the default value if the key is not found.
#ce
Func IniRead($filename, $section, $key, $default)
    #native code
EndFunc

#cs
# Reads all key/value pairs from a section in a standard format .ini file.
#
# @param String $filename The filename of the .ini file.
# @param String $section The section name in the .ini file.
#
# @return Array A 2 dimensional array where element[n][0] is the key and element[n][1] is the value.
#ce
Func IniReadSection($filename, $section)
    #native code
EndFunc

#cs
# Reads all sections in a standard format .ini file.
#
# @param String $filename The filename of the .ini file.
#
# @return Array An array of section names.
#ce
Func IniReadSectionNames($filename)
    #native code
EndFunc

#cs
# Renames a section in a standard format .ini file.
#
# @param String $filename The filename of the .ini file.
# @param String $oldSection The old section name in the .ini file.
# @param String $newSection The new section name in the .ini file.
# @param Int $flag $FC_NOOVERWRITE(0) = (default) Fail if "new section" already exists.
# $FC_OVERWRITE(1) = Overwrite "new section". This will erase any existing keys in "new section".
# Constants are defined in FileConstants.au3.
#
# @return Int Non-zero if successful or 0 and may sets the @error flag to non-zero, if renaming failed because the section already exists (only when flag = 0).
#ce
Func IniRenameSection($filename, $oldSection, $newSection, $flag = 0)
    #native code
EndFunc

#cs
# Writes a value to a standard format .ini file.
#
# @param String $filename The filename of the .ini file.
# @param String $section The section name in the .ini file.
# @param String $key The key name in the .ini file.
# @param String $value The value to write to the .ini file.
#
# @return 0|1 1 if successful, 0 if file is read-only.
#ce
Func IniWrite($filename, $section, $key, $value)
    #native code
EndFunc

#cs
# Writes a section to a standard format .ini file.
#
# @param String $filename The filename of the .ini file.
# @param String $section The section name in the .ini file.
# @param Array $data The data to write. The data can either be a string or an array. If the data is a string, then each key=value pair must be delimited by @LF. If the data is an array, the array must be 2-dimensional and the second dimension must be 2 elements.
# @param Int $index If an array is passed as data, this specifies the index to start writing from. By default, this is 1 so that the return value of IniReadSection() can be used immediately. For manually created arrays, this value may need to be different depending on how the array was created. This parameter is ignored if a string is passed as data.
#
# @return 0|1 1 if successful or 0 and The function will sets the @error flag to 1 if the data format is invalid.
#ce
Func IniWriteSection($filename, $section, $data, $index = 1)
    #native code
EndFunc

#cs
# Displays an input box to ask the user to enter a string.
#
# @param String $title The title of the input box.
# @param String $prompt The prompt to display to the user.
# @param String $default The value that the input box starts with.
# @param String $passwordChar The character to replace all typed characters with in the display. If you want the actual typed character to appear, define with an empty string ("") (default) or a space for the first character. If you provide a multi-character string, only the first character is used for character masking. There are special meanings for the second and subsequent characters.
# @param Int $width The width of the window.
# @param Int $height The height of the window.
# @param Int $left The left side of the input box. By default, the box is centered.
# @param Int $top The top of the input box. By default, the box is centered.
# @param Int $timeout How many seconds to wait before automatically canceling the InputBox().
# @param Hwnd $hwnd The window handle to use as the parent for this dialog.
#
# @return String The string that was entered.
#ce
Func InputBox($title, $prompt, $default = "", $passwordChar = "", $width = -1, $height = -1, $left = Default, $top = Default, $timeout = 0, $hwnd = 0)
    #native code
EndFunc

#cs
# Returns the integer (whole number) representation of an expression.
#
# @param String $expression An expression to convert into an integer.
# @param Int $flag Defines behavior.
# Can be one of the following:
# $NUMBER_AUTO (0) = (default) the result is auto-sized integer. See remarks.
# $NUMBER_32BIT (1) = string is interpreted as a 32bit integer
# $NUMBER_64BIT (2) = string is interpreted as a 64bit integer
# Constants are defined in "AutoItConstants.au3".
#
# @return Int
#ce
Func Int($expression, $flag = 0)
    #native code
EndFunc

#cs
# Checks if the current user has full administrator privileges.
#
# @return 0|1 1 if the current user has administrator privileges or 0 if user lacks admin privileges.
#ce
Func IsAdmin()
    #native code
EndFunc

#cs
# Checks if a variable is an array type.
#
# @param Mixed $variable The variable to check.
#
# @return 0|1
#ce
Func IsArray($variable)
    #native code
EndFunc

#cs
# Checks if a variable or expression is a binary type.
#
# @param Mixed $variable The variable or expression to check.
#
# @return 0|1
#ce
Func IsBinary($variable)
    #native code
EndFunc

#cs
# Checks if a variable's base type is boolean.
#
# @param Mixed $variable The variable to check.
#
# @return 0|1
#ce
Func IsBool($variable)
    #native code
EndFunc

#cs
# Check if a variable has been declared.
#
# @param String $expression The variable to check.
#
# @return 0|1 $DECLARED_GLOBAL (1) for Global variable or variable declared outside functions.
# $DECLARED_LOCAL (-1) for Local variable.
# $DECLARED_UNKNOWN (0) when no variable can be found.
# Constants are defined in AutoItConstants.au3
#ce
Func IsDeclared($expression)
    #native code
EndFunc

#cs
# Checks if a variable is a DllStruct type.
#
# @param Mixed $variable The variable to check.
#
# @return 0|1
#ce
Func IsDllStruct($variable)
    #native code
EndFunc

#cs
# Checks if the value of a variable or expression has a fractional component.
#
# @param Mixed $variable The variable or expression to check.
#
# @return 0|1
#ce
Func IsFloat($variable)
    #native code
EndFunc

#cs
# Checks if a variable or expression is a function type.
#
# @param Mixed $variable The variable or expression to check.
#
# @return 0|1|2 1 if the variable is a User-defined function, 2 if the variable is a native function. 0 if expression is not function type.
#ce
Func IsFunc($variable)
    #native code
EndFunc

#cs
# Checks if a variable's base type is a pointer and window handle.
#
# @param Mixed $variable The variable to check.
#
# @return 0|1 1 if the expression is a pointer type AND a valid window handle. 0 if expression is not a pointer OR not a valid window handle.
#ce
Func IsHWnd($variable)
    #native code
EndFunc

#cs
# Checks if the value of a variable or expression has no fractional component.
#
# @param Mixed $variable The variable or expression to check.
#
# @return 0|1
#ce
Func IsInt($variable)
    #native code
EndFunc

#cs
# Checks if a variable is a keyword (for example, Default).
#
# @param Mixed $variable The variable to check.
#
# @return 0|1|2 $KEYWORD_DEFAULT (1) the Default keyword.
# $KEYWORD_NULL (2) the Null keyword.
# 0 if not a keyword.
# Constants are defined in AutoItConstants.au3
#ce
Func IsKeyword($variable)
    #native code
EndFunc

#cs
# Checks if a variable is a Map type.
#
# @param Mixed $variable The variable to check.
#
# @return 0|1
#ce
Func IsMap($variable)
    #native code
EndFunc

#cs
# Checks if a variable's base type is numeric.
#
# @param Mixed $variable The variable to check.
#
# @return 0|1
#ce
Func IsNumber($variable)
    #native code
EndFunc

#cs
# Checks if a variable or expression is an object type.
#
# @param Mixed $variable The variable or expression to check.
#
# @return 0|1
#ce
Func IsObj($variable)
    #native code
EndFunc

#cs
# Checks if a variable's base type is a pointer.
#
# @param Mixed $variable The variable to check.
#
# @return 0|1
#ce
Func IsPtr($variable)
    #native code
EndFunc

#cs
# Checks if a variable is a string type.
#
# @param Mixed $variable The variable to check.
#
# @return 0|1
#ce
Func IsString($variable)
    #native code
EndFunc

#cs
# Calculates the natural logarithm of a number.
#
# @param Number $expression Any positive number.
#
# @return Double The parameter's natural logarithm. Tends to return -1.#IND for non-positive parameters.
#ce
Func Log($expression)
    #native code
EndFunc

#cs
# Add an element to a Map variable.
#
# The value will be added using the next available integer key
#
# @param Map $map An existing Map
# @param Mixed $value The value to add to the Map.
#
# @return Int The integer key used to add the value or 0 and sets the @error flag to non-zero
#ce
Func MapAppend($map, $value)
    #native code
EndFunc

#cs
# Determine whether a key exists within a Map.
#
# @param Map $map An existing Map
# @param String $key The key to check
#
# @return 0|1
#ce
Func MapExists($map, $key)
    #native code
EndFunc

#cs
# Returns an array holding the keys within a Map.
#
# @param Map $map An existing Map
#
# @return Array
#ce
Func MapKeys($map)
    #native code
EndFunc

#cs
# Remove a key and its associated value from a Map.
#
# @param Map $map An existing Map
# @param String $key The key to remove
#
# @return 0|1
#ce
Func MapRemove($map, $key)
    #native code
EndFunc

#cs
# Retrieves memory related information.
#
# @return Array A seven-element array containing the memory information:
# $aArray[$MEM_LOAD] = Memory Load (Percentage of memory in use)
# $aArray[$MEM_TOTALPHYSRAM] = Total physical RAM
# $aArray[$MEM_AVAILPHYSRAM] = Available physical RAM
# $aArray[$MEM_TOTALPAGEFILE] = Total Pagefile
# $aArray[$MEM_AVAILPAGEFILE] = Available Pagefile
# $aArray[$MEM_TOTALVIRTUAL] = Total virtual
# $aArray[$MEM_AVAILVIRTUAL] = Available virtual
#ce
Func MemGetStats()
    #native code
EndFunc

#cs
# Performs the modulus operation.
#
# @param Int $value1 The dividend.
# @param Int $value2 The divisor.
#
# @return Number The remainder when value1 is divided by value2 or -1.#IND if the divisor is zero.
#ce
Func Mod($value1, $value2)
    #native code
EndFunc

#cs
# Perform a mouse click operation.
#
# @param String $button The button to click:
# $MOUSE_CLICK_LEFT ("left")
# $MOUSE_CLICK_RIGHT ("right")
# $MOUSE_CLICK_MIDDLE ("middle")
# $MOUSE_CLICK_MAIN ("main")
# $MOUSE_CLICK_MENU ("menu")
# $MOUSE_CLICK_PRIMARY ("primary")
# $MOUSE_CLICK_SECONDARY ("secondary")
# Constants are defined in "AutoItConstants.au3".
# @param Number $x The x coordinates to move the mouse to. If no x coords are given, the current position is used
# @param Number $y The y coordinates to move the mouse to. If no y coords are given, the current position is used
# @param Int $clicks The number of clicks to perform. Default is 1.
# @param Int $speed The speed to move the mouse in the range 1 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly.
#
# @return 0|1
#ce
Func MouseClick($button, $x = Default, $y = Default, $clicks = 1, $speed = 10)
    #native code
EndFunc

#cs
# Perform a mouse click and drag operation.
#
# @param String $button The button to click:
# $MOUSE_CLICK_LEFT ("left")
# $MOUSE_CLICK_RIGHT ("right")
# $MOUSE_CLICK_MIDDLE ("middle")
# $MOUSE_CLICK_MAIN ("main")
# $MOUSE_CLICK_MENU ("menu")
# $MOUSE_CLICK_PRIMARY ("primary")
# $MOUSE_CLICK_SECONDARY ("secondary")
# Constants are defined in "AutoItConstants.au3".
# @param Number $x1 The x coord to start the drag operation from.
# @param Number $y1 The y coord to start the drag operation from.
# @param Number $x2 The x coords to end the drag operation at.
# @param Number $y2 The y coords to end the drag operation at.
# @param Int $speed The speed to move the mouse in the range 1 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly.
#
# @return 0|1
#ce
Func MouseClickDrag($button, $x1, $y1, $x2, $y2, $speed = 10)
    #native code
EndFunc

#cs
# Perform a mouse down event at the current mouse position.
#
# @param String $button The button to click:
# $MOUSE_CLICK_LEFT ("left")
# $MOUSE_CLICK_RIGHT ("right")
# $MOUSE_CLICK_MIDDLE ("middle")
# $MOUSE_CLICK_MAIN ("main")
# $MOUSE_CLICK_MENU ("menu")
# $MOUSE_CLICK_PRIMARY ("primary")
# $MOUSE_CLICK_SECONDARY ("secondary")
# Constants are defined in "AutoItConstants.au3".
#
# @return 0|1
#ce
Func MouseDown($button)
    #native code
EndFunc

#cs
# Returns the cursor ID Number for the current Mouse Cursor.
#
# @return Int Returns a cursor ID Number:
# $MCID_UNKNOWN (-1) : (@error can be set if the handle to the cursor cannot be found)
# $MCID_HAND (0)
# $MCID_APPSTARTING (1)
# $MCID_ARROW (2)
# $MCID_CROSS (3)
# $MCID_HELP (4)
# $MCID_IBEAM (5)
# $MCID_ICON (6) (Obsolete for applications marked version 4.0 or later)
# $MCID_NO (7)
# $MCID_SIZE (8) (Obsolete for applications marked version 4.0 or later)
# $MCID_SIZEALL (9)
# $MCID_SIZENESW (10)
# $MCID_SIZENS (11)
# $MCID_SIZENWSE (12)
# MCID_SIZEWE (13)
# $MCID_UPARROW (14)
# $MCID_WAIT (15)
# $MCID_NONE (16)
# Constants are defined in "AutoItConstants.au3".
#ce
Func MouseGetCursor()
    #native code
EndFunc

#cs
# Retrieves the current position of the mouse cursor.
#
# @param 0|1 $dimension 0 = X, 1 = Y
#
# @return Array|Int [X, Y] or Int if no dimension is specified
#ce
Func MouseGetPos($dimension = Default)
    #native code
EndFunc

#cs
# Moves the mouse pointer.
#
# @param Number $x The screen x coordinate to move the mouse to.
# @param Number $y The screen y coordinate to move the mouse to.
# @param Int $speed The speed to move the mouse in the range 1 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly.
#
# @return Void
#ce
Func MouseMove($x, $y, $speed = 10)
    #native code
EndFunc

#cs
# Perform a mouse up event at the current mouse position.
#
# @param String $button The button to click:
# $MOUSE_CLICK_LEFT ("left")
# $MOUSE_CLICK_RIGHT ("right")
# $MOUSE_CLICK_MIDDLE ("middle")
# $MOUSE_CLICK_MAIN ("main")
# $MOUSE_CLICK_MENU ("menu")
# $MOUSE_CLICK_PRIMARY ("primary")
# $MOUSE_CLICK_SECONDARY ("secondary")
# Constants are defined in "AutoItConstants.au3".
#
# @return 0|1
#ce
Func MouseUp($button)
    #native code
EndFunc

#cs
# Moves the mouse wheel up or down.
#
# @param String $direction The direction to move the mouse wheel:
# $MOUSE_WHEEL_UP ("up")
# $MOUSE_WHEEL_DOWN ("down")
# Constants are defined in "AutoItConstants.au3".
# @param Int $clicks The number of times to move the mouse wheel.
#
# @return 0|1
#ce
Func MouseWheel($direction, $clicks = 1)
    #native code
EndFunc

#cs
# Displays a simple message box with optional timeout.
#
# @param String $flag The flag indicates the type of message box and the possible button combinations.
# @param String $title The title of the message box.
# @param String $text The text of the message box.
# @param Int $timeout Timeout in seconds. After the timeout has elapsed the message box will close automatically. If 0, no timeout is set.
# @param Int $hwnd The window handle to use as the parent for this dialog.
#
# @return Int the ID of the button pressed or $IDTIMEOUT (-1) if the message box timed out.
#ce
Func MsgBox($flag, $title, $text, $timeout = 0, $hwnd = 0)
    #native code
EndFunc

#cs
# Returns the numeric representation of an expression.
#
# @param String $expression The expression to convert into a number.
# @param Int $flag Can be one of the following:
# $NUMBER_AUTO (0) = (default) the result is auto-sized integer. See remarks.
# $NUMBER_32BIT (1) = the result is 32bit integer.
# $NUMBER_64BIT (2) = the result is 64bit integer.
# $NUMBER_DOUBLE (3) = the result is double.
# Constants are defined in "AutoItConstants.au3".
#
# @return Number
#ce
Func Number($expression, $flag = 0)
    #native code
EndFunc

#cs
# Creates a reference to a COM object from the given classname.
#
# @param String $classname The class of the object in the following format: "appname.objectype"
# It can also be a string representation of the CLSID.
# @param String $servername The name of a remote computer from which the object must be obtained.
# @param String $username The name of a usercode on the remote computer.
# You have to enter this in the format "computer\usercode" or "domain\usercode".
# @param String $password The password for the usercode on the remote computer.
#
# @return Object
#ce
Func ObjCreate($classname, $servername = Default, $username = Default, $password = Default)
    #native code
EndFunc

#cs
# Creates a reference to an object from the given classname/object pointer, interface identifier and description string.
#
# @param String|Ptr $CLSID Class identifier or object pointer. If this is a class identifier it can be in either ProgID or the string representation of the CLSID.
# @param String $IID String representation of interface identifier.
# @param String $interface_description String describing v-table of the object. Use keyword Default to access IDispatch for dual interfaces.
# @param Boolean $flag Default value is True meaning the object interface inherits from IUnknown.
#
# @return Object
#ce
Func ObjCreateInterface($CLSID, $IID, $interface_description, $flag = True)
    #native code
EndFunc

#cs
# Handles incoming events from the given Object.
#
# @param Object|String $ObjectVar A variable containing an Object from which you want to receive events or "AutoIt.Error"
# @param String $functionprefix The prefix of the functions you define to handle receiving events.
# The prefix is appended by the Objects method name.
# @param String $interface_name The name of an Event interface to use.
# Note: It must be a supported as outgoing for the Object AND it must be of type DISPATCH.
#
# @return Object|String An object or a function name.
#ce
Func ObjEvent($ObjectVar, $functionprefix = Default, $interface_name = Default);WARNING: AutoIt.Error and normal object event conflicting function parameter signatures!
    #native code
EndFunc

#cs
# Retrieves a reference to a COM object from an existing process or filename.
#
# @param String $filename The full path and name to the file containing the object (See remarks).
# @param String $classname Class identifier. Can be in either ProgID or the string representation of the CLSID.
# @param Unknown $instance Instance of the object for ROT objects of the same (co)class.
#
# @return Object
#ce
Func ObjGet($filename, $classname = Default, $instance = Default)
    #native code
EndFunc

#cs
# Returns the name or interface description of an Object.
#
# @param Object $Objectvariable A variable containing an Object.
# @param Int $Flag $OBJ_NAME (1) = (default) The name of the Object
# $OBJ_STRING (2) = Description string of the Object
# $OBJ_PROGID (3) = The ProgID of the Object
# $OBJ_FILE (4) = The file that is associated with the object in the Registry
# $OBJ_MODULE (5) = Module name in which the object runs (WIN XP And above). Marshaller for non-inproc objects.
# $OBJ_CLSID (6) = CLSID of the object's coclass
# $OBJ_IID (7) = IID of the object's interface
# Constants are defined in "AutoItConstants.au3".
#
# @return String
#ce
Func ObjName($Objectvariable, $Flag = 1)
    #native code
EndFunc

#cs
# Registers a function to be called when AutoIt exits.
#
# @param String $function The name of the function to be called when AutoIt exits.
#
# @return 0|1 @extended can be set if already registered.
#ce
Func OnAutoItExitRegister($function)
    #native code
EndFunc

#cs
# UnRegisters a function that was called when AutoIt exits.
#
# @param String $function The name of the function to be unregistered.
#
# @return 0|1
#ce
Func OnAutoItExitUnRegister($function)
    #native code
EndFunc

#cs
# Pings a host and returns the roundtrip-time.
#
# @param String $address The address or hostname to ping.
# @param Int $timeout The timeout in milliseconds.
#
# @return Int The roundtrip-time in milliseconds ( greater than 0 ).
#ce
Func Ping($address, $timeout = 4000)
    #native code
EndFunc

#cs
# Generates a checksum for a region of pixels.
#
# @param Int $left The left coordinate of rectangle.
# @param Int $top The top coordinate of rectangle.
# @param Int $right The right coordinate of rectangle.
# @param Int $bottom The bottom coordinate of rectangle.
# @param Int $step The step in pixels between each pixel in the region. It is not recommended to use a step value greater than 1.
# @param Int $hwnd Window handle to be used. Default is the desktop window. See remark.
# @param Int $mode 0 = ADLER checksum, 1 = CRC32 checksum
#
# @return Int The checksum value of the region.
#ce
Func PixelChecksum($left, $top, $right, $bottom, $step = 1, $hwnd = Default, $mode = 0)
    #native code
EndFunc

#cs
# Returns a pixel color according to x,y pixel coordinates.
#
# @param Int $x The x coordinate of the pixel.
# @param Int $y The y coordinate of the pixel.
# @param Int $hwnd Window handle to be used. Default is the desktop window. See remark.
#
# @return Int A decimal value of pixel's color.
#ce
Func PixelGetColor($x, $y, $hwnd = Default)
    #native code
EndFunc

#cs
# Searches a rectangle of pixels for the pixel color provided.
#
# @param Int $left The left coordinate of rectangle.
# @param Int $top The top coordinate of rectangle.
# @param Int $right The right coordinate of rectangle.
# @param Int $bottom The bottom coordinate of rectangle.
# @param Int $color The color to search for.
# @param Int $shade_variation A number between 0 and 255 to indicate the allowed number of shades of variation of the red, green, and blue components of the color. 0 is exact match.
# @param Int $step The step in pixels between each pixel in the region. It is not recommended to use a step value greater than 1.
# @param Int $hwnd Window handle to be used. Default is the desktop window. See remark.
#
# @return Array A two-element array of pixel's coordinates. (Array[0] = x, Array[1] = y).
#ce
Func PixelSearch($left, $top, $right, $bottom, $color, $shade_variation = 0, $step = 1, $hwnd = Default)
    #native code
EndFunc

#cs
# Terminates a named process.
#
# @param String|Int $process The name or PID of the process to terminate.
#
# @return 0|1
#ce
Func ProcessClose($process)
    #native code
EndFunc

#cs
# Checks to see if a specified process exists.
#
# @param String|Int $process The name or PID of the process to check.
#
# @return Int The PID of the process or 0 if process does not exist.
#ce
Func ProcessExists($process)
    #native code
EndFunc

#cs
# Returns an array about Memory or IO infos of a running process.
#
# @param String|Int $process The name or PID of the process to get info from. -1 is the current process.
# @param 0|1 $PROCESS_STATS_MEMORY (0) = (default) memory infos.
# $PROCESS_STATS_IO (1) = IO infos.
# Constants are defined in "AutoItConstants.au3".
#
# @return Array
#ce
Func ProcessGetStats($process = -1, $type = 0)
    #native code
EndFunc

#cs
# Returns an array listing the currently running processes (names and PIDs).
#
# @param String $name If a name is given only processes of the same name will be returned.
#
# @return Array The array returned is two-dimensional and is made up as follows:
# $aArray[0][0] = Number of processes
# $aArray[1][0] = 1st Process name
# $aArray[1][1] = 1st Process ID (PID)
# $aArray[2][0] = 2nd Process name
# $aArray[2][1] = 2nd Process ID (PID)
# ...
# $aArray[n][0] = nth Process name
# $aArray[n][1] = nth Process ID (PID)
# The list can be empty if $aArray[0][0] = 0. No @error set in this case.
#ce
Func ProcessList($name = Default)
    #native code
EndFunc

#cs
# Changes the priority of a process.
#
# @param String|Int $process The name or PID of the process to change.
# @param Int $priority A flag which determines what priority to set
# $PROCESS_LOW (0) = Idle/Low
# $PROCESS_BELOWNORMAL (1) = Below Normal
# $PROCESS_NORMAL (2) = Normal
# $PROCESS_ABOVENORMAL (3) = Above Normal
# $PROCESS_HIGH (4) = High
# $PROCESS_REALTIME (5) = Realtime (Use with caution, may make the system unstable)
# Constants are define in "AutoItConstants.au3".
#
# @return 0|1
#ce
Func ProcessSetPriority($process, $priority)
    #native code
EndFunc

#cs
# Pauses script execution until a given process exists.
#
# @param String $process The name of the process to check.
# @param Int $timeout The maximum number of seconds to wait for the process to exist. 0 means no timeout.
#
# @return Int The PID of the process or 0 if the wait timed out.
#ce
Func ProcessWait($process, $timeout = 0)
    #native code
EndFunc

#cs
# Pauses script execution until a given process does not exist.
#
# @param String $process The name of the process to check.
# @param Int $timeout The maximum number of seconds to wait for the process to exist. 0 means no timeout.
#
# @return Int The PID of the process or 0 if the wait timed out.
#ce
Func ProcessWaitClose($process, $timeout = 0)
    #native code
EndFunc

#cs
# Turns Progress window off.
#
# @return Void
#ce
Func ProgressOff()
    #native code
EndFunc

#cs
# Creates a customizable progress bar window.
#
# @param String $title The title of the progress bar window.
# @param String $maintext The main text of the progress bar window.
# @param String $subtext The sub text of the progress bar window.
# @param Int $x The X position of the progress bar window. Default is the center of the screen.
# @param Int $y The Y position of the progress bar window. Default is the center of the screen.
# @param Int $opt Default is 'always on top/with title/not moveable'
# Add up the following options you want:
# $DLG_NOTITLE (1) = borderless, titleless window
# $DLG_NOTONTOP (2) = Without "always on top" attribute
# $DLG_MOVEABLE (16) = Window can be moved
# Constants are defined in AutoItConstants.au3
#
# @return Void
#ce
Func ProgressOn($title, $maintext, $subtext = "", $x = Default, $y = Default, $opt = 0)
    #native code
EndFunc

#cs
# Sets the position and/or text of a previously created Progress bar window.
#
# @param Int $percent The percentage of the progress bar window. (value between 0. and 100)
# @param String $subtext The sub text of the progress bar window.
# @param String $maintext The main text of the progress bar window.
#
# @return Void
#ce
Func ProgressSet($percent, $subtext = Default, $maintext = Default)
    #native code
EndFunc

#cs
# Converts an expression into a pointer variant.
#
# @param Any $expression An expression to convert into a pointer variant.
#
# @return Ptr
#ce
Func Ptr($expression)
    #native code
EndFunc

#cs
# Generates a pseudo-random float-type number.
#
# @param Int $min The minimum value of the random number.
# @param Int $max The maximum value of the random number.
# @param Int $flag 0 = Float, 1 = Int
#
# @return Float|Int
#ce
Func Random($Min = 0, $Max = 1, $Flag = 0)
    #native code
EndFunc

#cs
# Deletes a key or value from the registry.
#
# @param String $keyname The name of the key to delete.
# @param String $valuename The name of the value to delete.
#
# @return 0|1|2 1 if successful, 0 if the key does not exist, 2 if there was and error.
#ce
Func RegDelete($keyname, $valuename = Default)
    #native code
EndFunc

#cs
# Reads the name of a subkey according to its instance.
#
# @param String $keyname The name of the key to read.
# @param Int $instance The 1-based key instance of the subkey to read.
#
# @return String
#ce
Func RegEnumKey($keyname, $instance)
    #native code
EndFunc

#cs
# Reads the name of a value according to its instance.
#
# @param String $keyname The name of the key to read.
# @param Int $instance The 1-based value instance of the value to read.
#
# @return String
#ce
Func RegEnumVal($keyname, $instance)
    #native code
EndFunc

#cs
# Reads a value from the registry.
#
# @param String $keyname The name of the key to read.
# @param String $valuename The name of the value to read.
#
# @return Mixed The value read from the registry.
#ce
Func RegRead($keyname, $valuename)
    #native code
EndFunc

#cs
# Creates a key or value in the registry.
#
# @param String $keyname The name of the key to create. If no other parameters are specified this key will simply be created.
# @param String $valuename The name of the value to create.
# @param String $type The type of the value to create.
# @param String $value The value to create.
#
# @return 0|1
#ce
Func RegWrite($keyname, $valuename = Default, $type = Default, $value = Default)
    #native code
EndFunc

#cs
# Returns a number rounded to a specified number of decimal places.
#
# @param Number $expression The number to round.
# @param Int $decimalplaces The number of decimal places to round to.
#
# @return Float|Int
#ce
Func Round($expression, $decimalplaces = 0)
    #native code
EndFunc

#cs
# Runs an external program.
#
# @param String $program The name of the program to run.
# @param String $workingdir The working directory of the program.
# @param Int $show_flag The "show" flag of the program.
# @param Int $opt_flag Controls various options related to how the parent and child process interact.
# $STDIN_CHILD (0x1) = Provide a handle to the child's STDIN stream
# $STDOUT_CHILD (0x2) = Provide a handle to the child's STDOUT stream
# $STDERR_CHILD (0x4) = Provide a handle to the child's STDERR stream
# $STDERR_MERGED (0x8) = Provides the same handle for STDOUT and STDERR. Implies both $STDOUT_CHILD and $STDERR_CHILD.
# $STDIO_INHERIT_PARENT (0x10) = Provide the child with the parent's STDIO streams. This flag can not be combined with any other STDIO flag. This flag is only useful when the parent is compiled as a Console application.
# $RUN_CREATE_NEW_CONSOLE (0x10000) = The child console process should be created with it's own window instead of using the parent's window. This flag is only useful when the parent is compiled as a Console application.
# Constants are defined in AutoItConstants.au3.
#
# @return Int The PID of the process that was launched or 0 if an error occurred.
#ce
Func Run($program, $workingdir = "", $show_flag = Default, $opt_flag = 0)
    #native code
EndFunc

#cs
# Runs an external program under the context of a different user.
#
# @param String $username The username to use.
# @param String $domain The domain to use.
# @param String $password The password to use.
# @param Int $logon_flag $RUN_LOGON_NOPROFILE (0) - Interactive logon with no profile.
# $RUN_LOGON_PROFILE (1) - Interactive logon with profile.
# $RUN_LOGON_NETWORK (2) - Network credentials only.
# $RUN_LOGON_INHERIT (4) - Inherit the calling process's environment instead of the user's environment.
# Constants are defined in "AutoItConstants.au3".
# @param String $program The full path of the program (EXE, BAT, COM, or PIF) to run (see remarks).
# @param String $workingdir The working directory of the program.
# @param Int $show_flag The "show" flag of the program.
# @param Int $opt_flag Controls various options related to how the parent and child process interact.
# $STDIN_CHILD (0x1) = Provide a handle to the child's STDIN stream
# $STDOUT_CHILD (0x2) = Provide a handle to the child's STDOUT stream
# $STDERR_CHILD (0x4) = Provide a handle to the child's STDERR stream
# $STDERR_MERGED (0x8) = Provides the same handle for STDOUT and STDERR. Implies both $STDOUT_CHILD and $STDERR_CHILD.
# $STDIO_INHERIT_PARENT (0x10) = Provide the child with the parent's STDIO streams. This flag can not be combined with any other STDIO flag. This flag is only useful when the parent is compiled as a Console application.
# $RUN_CREATE_NEW_CONSOLE (0x10000) = The child console process should be created with it's own window instead of using the parent's window. This flag is only useful when the parent is compiled as a Console application.
# Constants are defined in AutoItConstants.au3
#
# @return Int The PID of the process that was launched or 0 if an error occurred.
#ce
Func RunAs($username, $domain, $password, $logon_flag, $program, $workingdir = @SystemDir, $show_flag = Default, $opt_flag = 0)
    #native code
EndFunc

#cs
# Runs an external program under the context of a different user and pauses script execution until the program finishes.
#
# @param String $username The username to use.
# @param String $domain The domain to use.
# @param String $password The password to use.
# @param Int $logon_flag$RUN_LOGON_NOPROFILE (0) - Interactive logon with no profile.
# $RUN_LOGON_PROFILE (1) - Interactive logon with profile.
# $RUN_LOGON_NETWORK (2) - Network credentials only.
# $RUN_LOGON_INHERIT (4) - Inherit the calling process's environment instead of the user's environment.
# Constants are defined in "AutoItConstants.au3".
# @param String $program The full path of the program (EXE, BAT, COM, or PIF) to run (see remarks).
# @param String $workingdir The working directory of the program.
# @param Int $show_flag The "show" flag of the program.
# @param Int $opt_flag Controls various options related to how the parent and child process interact.
# $RUN_CREATE_NEW_CONSOLE (0x10000) = The child console process should be created with its own window instead of using the parent's window. This flag is only useful when the parent is compiled as a Console application.
# Constant is defined in AutoItConstants.au3
#
# @return Int The exit code of the program that was run.
#ce
Func RunAsWait($username, $domain, $password, $logon_flag, $program, $workingdir = @SystemDir, $show_flag = Default, $opt_flag = 0)
    #native code
EndFunc

#cs
# Runs an external program and pauses script execution until the program finishes.
#
# @param String $program The name of the program to run.
# @param String $workingdir The working directory of the program.
# @param Int $show_flag The "show" flag of the program.
# @param Int $opt_flag Controls various options related to how the parent and child process interact.
# 0x10000 ($RUN_CREATE_NEW_CONSOLE) = The child console process should be created with its own window instead of using the parents window. This flag is only useful when the parent is compiled as a Console application.
#
# @return Int The exit code of the program that was run.
#ce
Func RunWait($program, $workingdir = "", $show_flag = Default, $opt_flag = 0)
    #native code
EndFunc

#cs
# Sends simulated keystrokes to the active window.
#
# @param String $keys The sequence of keys to send.
# @param Int $flag Changes how "keys" is processed:
# $SEND_DEFAULT (0) = Text contains special characters like + and ! to indicate SHIFT and ALT key-presses (default).
# $SEND_RAW (1) = keys are sent raw.
# Constants are defined in "AutoItConstants.au3".
#
# @return Void
#ce
Func Send($keys, $flag = 0)
    #native code
EndFunc

#cs
# Attempts to keep a specified window active during Send().
#
# @param String $title The title/hWnd/class of the window to activate. See Title special definition. Use a blank title to disable the function.
# @param String $text The text of the window to keep active.
#
# @return 0|1 0 if window is not found.
#ce
Func SendKeepActive($title, $text = "")
    #native code
EndFunc

#cs
# Manually set the value of the @error macro (and optionally @extended, and "Return Value").
#
# @param Int $code The error code to set.
# @param Int $extended The extended error code to set.
# @param Mixed $return_value The value to be returned by the function.
#
# @return Mixed
#ce
Func SetError($code, $extended = 0, $return_value = 1)
    #native code
EndFunc

#cs
# Manually set the value of the @extended macro.
#
# @param Int $code The extended error code to set.
# @param Mixed $return_value The value to be returned by the function.
#
# @return Mixed
#ce
Func SetExtended($code, $return_value = 1)
    #native code
EndFunc

#cs
# Runs an external program using the ShellExecute API.
#
# @param String $filename The name of the file to run (EXE, .txt, .lnk, etc).
# @param String $parameters The parameters to pass to the program.
# @param String $workingdir The working directory of the program. Blank ("") uses the current working directory.
# @param Int $verb The "verb" to use, common verbs include:
# $SHEX_OPEN ("open") = Opens the file specified. The file can be an executable file, a document file, or a folder
# $SHEX_EDIT ("edit") = Launches an editor and opens the document for editing. If "filename" is not a document file, the function will fail
# $SHEX_PRINT ("print") = Prints the document file specified. If "filename" is not a document file, the function will fail
# $SHEX_PROPERTIES ("properties") = Displays the file or folder's properties
# See remarks for more information on the default behavior when a verb is not specified.
# Constants are defined in "AutoItConstants.au3".
# @param Int $show_flag The "show" flag of the program.
#
# @return Int The exit code of the program that was run.
#ce
Func ShellExecute($filename, $parameters = "", $workingdir = "", $verb = Default, $showflag = Default)
    #native code
EndFunc

#cs
# Runs an external program using the ShellExecute API and pauses script execution until it finishes.
#
# @param String $filename The name of the file to run (EXE, .txt, .lnk, etc).
# @param String $parameters The parameters to pass to the program.
# @param String $workingdir The working directory of the program. Blank ("") uses the current working directory.
# @param Int $verb The "verb" to use, common verbs include:
# $SHEX_OPEN ("open") = Opens the file specified. The file can be an executable file, a document file, or a folder
# $SHEX_EDIT ("edit") = Launches an editor and opens the document for editing. If "filename" is not a document file, the function will fail
# $SHEX_PRINT ("print") = Prints the document file specified. If "filename" is not a document file, the function will fail
# $SHEX_PROPERTIES ("properties") = Displays the file or folder's properties
# See remarks for more information on the default behavior when a verb is not specified.
# Constants are defined in "AutoItConstants.au3".
# @param Int $show_flag The "show" flag of the program.
#
# @return Int The exit code of the program that was run
#ce
Func ShellExecuteWait($filename, $parameters = "", $workingdir = "", $verb = Default, $showflag = Default)
    #native code
EndFunc

#cs
# Shuts down the system.
#
# @param Int $code A combination of shutdown codes. See "remarks".
#
# @return 0|1
#ce
Func Shutdown($code)
    #native code
EndFunc

#cs
# Calculates the sine of a number.
#
# @param Number $expression Value in radians.
#
# @return Float The trigonometric sine of the number.
#ce
Func Sin($expression)
    #native code
EndFunc

#cs
# Pause script execution.
#
# @param Int $delay The number of milliseconds to pause. Between 10 and 2147483647
#
# @return Void
#ce
Func Sleep($delay)
    #native code
EndFunc

#cs
# Play a sound file.
#
# @param String $filename The name of the file to play. (typically a WAV or MP3)
# @param Int $wait This flag determines if the script should wait for the sound to finish before continuing:
# $SOUND_WAIT(1) = wait until sound has finished
# $SOUND_NOWAIT(0) = continue script while sound is playing (default)
# Constants are defined in "AutoItConstants.au3".
#
# @return 1
#ce
Func SoundPlay($filename, $wait = 0)
    #native code
EndFunc

#cs
# Sets the system wave volume by percent.
#
# @param Int $percent The volume to set. Between 0 and 100
#
# @return 0|1
#ce
Func SoundSetWaveVolume($percent)
    #native code
EndFunc

#cs
# Creates a customizable image popup window.
#
# @param String $title The title of the popup window.
# @param String $file Full path\filename of image (BMP, GIF, or JPG)
# @param Int $width The width of the popup window.
# @param Int $height The height of the popup window.
# @param Int $x The x position of the popup window. (default is centered)
# @param Int $y The y position of the popup window. (default is centered)
# @param Int $opt Default is 'always on top/with title'
Add up the following options you want:
# $DLG_NOTITLE (1) = borderless, titleless window
# $DLG_NOTONTOP (2) = Without "always on top" attribute
# $DLG_MOVEABLE (16) = Window can be moved
# Constants are defined in AutoItConstants.au3.
#
# @return Void
#ce
Func SplashImageOn($title, $file, $width = 500, $height = 400, $x = Default, $y = Default, $opt = 0)
    #native code
EndFunc

#cs
# Turns SplashText or SplashImage off.
#
# @return Void
#ce
Func SplashOff()
    #native code
EndFunc

#cs
# Creates a customizable text popup window.
#
# @param String $title The title of the popup window.
# @param String $text The text of the popup window.
# @param Int $width The width of the popup window.
# @param Int $height The height of the popup window.
# @param Int $x The x position of the popup window. (default is centered)
# @param Int $y The y position of the popup window. (default is centered)
# @param Int $opt Add them up - default is 'center justified/always on top/with title'
# $DLG_CENTERONTOP (0) = Center justified/always on top/with title (default)
# $DLG_NOTITLE (1) = Thin bordered titleless window
# $DLG_NOTONTOP (2) = Without "always on top" attribute
# $DLG_TEXTLEFT (4) = Left justified text
# $DLG_TEXTRIGHT (8) = Right justified text
# $DLG_MOVEABLE (16) = Windows can be moved
# $DLG_TEXTVCENTER (32) = Center text vertically
# Constants are defined in AutoItConstants.au3.
# @param String $fontname Name of the font to use. (OS default GUI font is used if the font is "" or is not found)
# @param Int $fontsz ont size. (standard sizes are 6 8 9 10 11 12 14 16 18 20 22 24 26 28 36 48 72)
# @param Int $fontwt The weight of the font in the range 0 through 1000. For example, 400 is normal and 700 is bold. If this value is zero, a default weight is used.
# The following values are defined for convenience.
# $FW_DONTCARE (0) (Use the default font weight)
# $FW_THIN (100)
# $FW_EXTRALIGHT (200)
# $FW_LIGHT (300)
# $FW_NORMAL (400)
# $FW_MEDIUM (500)
# $FW_SEMIBOLD (600)
# $FW_BOLD (700)
# $FW_EXTRABOLD (800)
# $FW_HEAVY (900)
# Constants are defined in FontConstants.au3.
#
# @return Handle The Handle of the splash window that can be used in ControlSetText().
#ce
Func SplashTextOn($title, $text, $width = 500, $height = 400, $x = Default, $y = Default, $opt = 0, $fontname = "", $fontsz = 12, $fontwt = 0)
    #native code
EndFunc

#cs
# Calculates the square-root of a number.
#
# @param Float $expression The number to calculate the square-root of.
#
# @return Float -1.#IND if parameter is negative.
#ce
Func Sqrt($expression)
    #native code
EndFunc

#cs
# Set Seed for random number generation.
#
# @param Int $seed Seed value for random number generation. Number between -2^31 and 2^31-1
#
# @return Void
#ce
Func SRandom($seed)
    #native code
EndFunc

#cs
# Retrieves the text from a standard status bar control.
#
# @param String|Hwnd $title The title/hWnd/class of the window to check.
# @param String $text The text of the window to check.
# @param Int $part The part of the status bar control to retrieve.
#
# @return String
#ce
Func StatusbarGetText($title, $text = "", $part = 1)
    #native code
EndFunc

#cs
# Reads from the STDERR stream of a previously run child process.
#
# @param Int $process_id The process ID of the child process.
# @param Bool $peek If true, return the next character without removing it from the buffer.
# @param Bool $binary If true, read the data as binary instead of text.
#
# @return String|Binary @extended contains the number of bytes read.
#ce
Func StderrRead($process_id, $peek = False, $binary = False)
    #native code
EndFunc

#cs
# Writes a number of characters to the STDIN stream of a previously run child process.
#
# @param Int $process_id The process ID of the child process.
# @param String|Binary $data The data to write.
#
# @return Int The number of characters written.
#ce
Func StdinWrite($process_id, $data = Default)
    #native code
EndFunc

#cs
# Closes all resources associated with a process previously run with STDIO redirection.
#
# @param Int $process_id The process ID of the child process.
#
# @return Int 0 if the process did not have STDIO redirection or was already closed.
#ce
Func StdioClose($process_id)
    #native code
EndFunc

#cs
# Reads from the STDOUT stream of a previously run child process.
#
# @param Int $process_id The process ID of the child process.
# @param Bool $peek If true, return the next character without removing it from the buffer.
# @param Bool $binary If true, read the data as binary instead of text.
#
# @return String|Binary @extended contains the number of bytes read.
#ce
Func StdoutRead($process_id, $peek = False, $binary = False)
    #native code
EndFunc

#cs
# Returns the string representation of an expression.
#
# @param String $expression The expression to convert into a string.
#
# @return String
#ce
Func String($expression)
    #native code
EndFunc

#cs
# Takes a string and prefixes all linefeed characters ( Chr(10) ) with a carriage return character ( Chr(13) ).
#
# @param String $string The string to process.
#
# @return String
#ce
Func StringAddCR($string)
    #native code
EndFunc

#cs
# Compares two strings with options.
#
# @param String $string1 The first string to compare.
# @param String $string2 The second string to compare.
# @param Bool $casesense Flag to indicate if the operations should be case sensitive.
# $STR_NOCASESENSE (0) = not case sensitive, using the user's locale (default)
# $STR_CASESENSE (1) = case sensitive
# $STR_NOCASESENSEBASIC (2) = not case sensitive, using a basic/faster comparison
# Constants are defined in StringConstants.au3.
#
# @return Int 0 = equal, >0 = string1 > string2, <0 = string1 < string2
#ce
Func StringCompare($string1, $string2, $casesense = 0)
    #native code
EndFunc

#cs
# Returns a formatted string (similar to the C sprintf() function).
#
# @param String $format The format string.
# @param Mixed $var1
# @param Mixed $var2
# @param Mixed $var3
# @param Mixed $var4
# @param Mixed $var5
# @param Mixed $var6
# @param Mixed $var7
# @param Mixed $var8
# @param Mixed $var9
# @param Mixed $var10
# @param Mixed $var11
# @param Mixed $var12
# @param Mixed $var13
# @param Mixed $var14
# @param Mixed $var15
# @param Mixed $var16
# @param Mixed $var17
# @param Mixed $var18
# @param Mixed $var19
# @param Mixed $var20
# @param Mixed $var21
# @param Mixed $var22
# @param Mixed $var23
# @param Mixed $var24
# @param Mixed $var25
# @param Mixed $var26
# @param Mixed $var27
# @param Mixed $var28
# @param Mixed $var29
# @param Mixed $var30
# @param Mixed $var31
# @param Mixed $var32
#
# @return String
#ce
Func StringFormat($format, $var1, $var2, $var3, $var4, $var5, $var6, $var7, $var8, $var9, $var10, $var11, $var12, $var13, $var14, $var15, $var16, $var17, $var18, $var19, $var20, $var21, $var22, $var23, $var24, $var25, $var26, $var27, $var28, $var29, $var30, $var31, $var32)
    #native code
EndFunc

#cs
# Converts an array of ASCII codes to a string.
#
# @param Array $array An array of ASCII codes.
# @param Int $start The zero-based start index.
# @param Int $end The zero-based end index. Note that the character at this index is NOT included in the output.
# @param Int $encoding The array contains values in the specified character set:
# $SE_UTF16 (0) = UTF-16 (Default)
# $SE_ANSI (1) = ANSI
# $SE_UTF8 (2) = UTF-8
# Constants are defined in StringConstants.au3.
#
# @return String String with character representations of the ASCII codes.
#ce
Func StringFromASCIIArray($array, $start = 0, $end = -1, $encoding = 0)
    #native code
EndFunc

#cs
# Checks if a string contains a given substring.
#
# @param String $string The string to check.
# @param String $substring The substring to check for.
# @param Int $casesense Flag to indicate if the operations should be case sensitive.
# $STR_NOCASESENSE (0) = not case sensitive, using the user's locale (default)
# $STR_CASESENSE (1) = case sensitive
# $STR_NOCASESENSEBASIC (2) = not case sensitive, using a basic/faster comparison
# Constants are defined in StringConstants.au3.
# @param Int $occurrence Which occurrence of the substring to find in the string. Use a negative occurrence to search from the right side. The default value is 1
# @param Int $start The 1-based start index of the search.
# @param Int $count The number of characters to search.
#
# @return Int The 1-based position of the substring or 0 if substring is not found.
#ce
Func StringInStr($string, $substring, $casesense = 0, $occurrence = 1, $start = 1, $count = Default)
    #native code
EndFunc

#cs
# Checks if a string contains only alphanumeric characters.
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsAlNum($string)
    #native code
EndFunc

#cs
# Checks if a string contains only alphabetic characters.
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsAlpha($string)
    #native code
EndFunc

#cs
# Checks if a string contains only ASCII characters in the range 0x00 - 0x7f (0 - 127).
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsASCII($string)
    #native code
EndFunc

#cs
# Checks if a string contains only digit (0-9) characters.
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsDigit($string)
    #native code
EndFunc

#cs
# Checks if a string is a floating point number.
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsFloat($string)
    #native code
EndFunc

#cs
# Checks if a string is an integer.
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsInt($string)
    #native code
EndFunc

#cs
# Checks if a string contains only lowercase characters.
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsLower($string)
    #native code
EndFunc

#cs
# Checks if a string contains only whitespace characters.
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsSpace($string)
    #native code
EndFunc

#cs
# Checks if a string contains only uppercase characters.
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsUpper($string)
    #native code
EndFunc

#cs
# Checks if a string contains only hexadecimal digit (0-9, A-F) characters.
#
# @param String $string The string to check.
#
# @return 0|1
#ce
Func StringIsXDigit($string)
    #native code
EndFunc

#cs
# Returns a number of characters from the left-hand side of a string.
#
# @param String $string The string to process.
# @param Int $count The number of characters to return.
#
# @return String
#ce
Func StringLeft($string, $count)
    #native code
EndFunc

#cs
# Returns the number of characters in a string.
#
# @param String $string The string to process.
#
# @return Int
#ce
Func StringLen($string)
    #native code
EndFunc

#cs
# Converts a string to lowercase.
#
# @param String $string The string to convert.
#
# @return String
#ce
Func StringLower($string)
    #native code
EndFunc

#cs
# Extracts a number of characters from a string.
#
# @param String $string The string to process.
# @param Int $start The 1-based start index of the extraction.
# @param Int $count The number of characters to extract. By default the entire remainder of the string.
#
# @return String
#ce
Func StringMid($string, $start, $count = -1)
    #native code
EndFunc

#cs
# Check if a string fits a given regular expression pattern.
#
# @param String $string The string to check.
# @param String $pattern The pattern to match against.
# @param Int $flag Value to determine the output format.
# @param Int $offset The 1-based start index of the search.
#
# @return 0|1|Array
#ce
Func StringRegExp($string, $pattern, $flag = 0, $offset = 1)
    #native code
EndFunc

#cs
# Replace text in a string based on regular expressions.
#
# @param String $string The string to process.
# @param String $pattern The pattern to match against.
# @param String $replace The replacement string. To insert matched group text, \0 - \9 (or $0 - $9) can be used as back-references. (See remarks).
# @param Int $count The maximum number of replacements. Use 0 for global replacement.
#
# @return String @extended contains the number of replacements performed.
#ce
Func StringRegExpReplace($string, $pattern, $replace, $count = 0)
    #native code
EndFunc

#cs
# Replaces substrings in a string.
#
# @param String $string The string to process.
# @param String|Int $find The substring to search for or the character position to start the replacement.
# @param String $replace The replacement string.
# @param Int $occurrence The number of occurrences to replace. Use 0 for all occurrences.
# @param Int $casesense Flag to indicate if the operations should be case sensitive.
# $STR_NOCASESENSE (0) = not case sensitive, using the user's locale (default)
# $STR_CASESENSE (1) = case sensitive
# $STR_NOCASESENSEBASIC (2) = not case sensitive, using a basic/faster comparison
# Constants are defined in StringConstants.au3.
#
# @return String @extended contains the number of replacements performed.
#ce
Func StringReplace($string, $find, $replace, $occurrence = 0, $casesense = 0)
    #native code
EndFunc

#cs
# Reverses the contents of the specified string.
#
# @param String $string The string to process.
# @param Int $flag Changes the way the string is reversed
# $STR_UTF16 (0) = reversed in full UTF-16 mode.
# $STR_UCS2 (1) = a much faster method - only use if using UCS-2 text.
# Constants are defined in "StringConstants.au3".
#
# @return String
#ce
Func StringReverse($string, $flag = 0)
    #native code
EndFunc

#cs
# Returns a number of characters from the right-hand side of a string.
#
# @param String $string The string to process.
# @param Int $count The number of characters to return.
#
# @return String
#ce
Func StringRight($string, $count)
    #native code
EndFunc

#cs
# Splits up a string into substrings depending on the given delimiters.
#
# @param String $string The string to process.
# @param String $delimiters The delimiters to use.
# @param Int $flag Changes how the string split works, add multiple flag values together if required:
# $STR_CHRSPLIT (0) = each character in the delimiter string will mark where to split the string (default)
# $STR_ENTIRESPLIT (1) = entire delimiter string is needed to mark the split
# $STR_NOCOUNT (2) = disable the return count in the first element - effectively makes the array 0-based (must use UBound() to get the size of the array in this case).
# Constants are defined in StringConstants.au3.
#
# @return Array
#ce
Func StringSplit($string, $delimiters, $flag = 0)
    #native code
EndFunc

#cs
# Removes all carriage return values ( Chr(13) ) from a string.
#
# @param String $string The string to process.
#
# @return String
#ce
Func StringStripCR($string)
    #native code
EndFunc

#cs
# Strips the white space in a string.
#
# @param String $string The string to process.
# @param Int $flag Flag to indicate the type of stripping that should be performed (add the flags together for multiple operations):
# $STR_STRIPLEADING (1) = strip leading white space
# $STR_STRIPTRAILING (2) = strip trailing white space
# $STR_STRIPSPACES (4) = strip double (or more) white spaces between words
# $STR_STRIPALL (8) = strip all spaces (over-rides all other flags)
# Constants are defined in StringConstants.au3.
#
# @return String
#ce
Func StringStripWS($string, $flag)
    #native code
EndFunc

#cs
# Converts a string to an array containing the ASCII code of each character.
#
# @param String $string The string to process.
# @param Int $start The zero-based start index.
# @param Int $end The zero-based end index. Note that the character at this index is NOT included in the output.
# @param Int $encoding The string contains values in the specified character set:
# $SE_UTF16 (0) = UTF-16 (Default)
# $SE_ANSI (1) = ANSI
# $SE_UTF8 (2) = UTF-8
# Constants are defined in StringConstants.au3.
#
# @return Array
#ce
Func StringToASCIIArray($string, $start = 0, $end = -1, $encoding = 0)
    #native code
EndFunc

#cs
# Converts a string into binary data.
#
# @param String $string The string to process.
# @param Int $flag Changes how the string is stored as binary:
# $SB_ANSI (1) = string data is ANSI (default)
# $SB_UTF16LE (2) = string data is UTF16 Little Endian
# $SB_UTF16BE (3) = string data is UTF16 Big Endian
# $SB_UTF8 (4) = string data is UTF8
# Constants are defined in StringConstants.au3.
#
# @return Binary
#ce
Func StringToBinary($string, $flag = 1)
    #native code
EndFunc

#cs
# Trims a number of characters from the left hand side of a string.
#
# @param String $string The string to process.
# @param Int $count The number of characters to trim.
#
# @return String
#ce
Func StringTrimLeft($string, $count)
    #native code
EndFunc

#cs
# Trims a number of characters from the right hand side of a string.
#
# @param String $string The string to process.
# @param Int $count The number of characters to trim.
#
# @return String
#ce
Func StringTrimRight($string, $count)
    #native code
EndFunc

#cs
# Converts a string to uppercase.
#
# @param String $string The string to convert.
#
# @return String
#ce
Func StringUpper($string)
    #native code
EndFunc

#cs
# Calculates the tangent of a number.
#
# @param Number $number Value in radians.
#
# @return Number
#ce
Func Tan($radians)
    #native code
EndFunc

#cs
# Permits an incoming connection attempt on a socket.
#
# @param Int $socket The main socket identifier (SocketID) as returned by a TCPListen() function.
#
# @return Int The connected socket identifier or -1 if an error occurred.
#ce
Func TCPAccept($socket)
    #native code
EndFunc

#cs
# Closes a TCP socket.
#
# @param Int $socket The socket identifier (SocketID) as returned by a TCPListen(),TCPConnect() or TCPAccept() functions.
#
# @return 0|1
#ce
Func TCPCloseSocket($socket)
    #native code
EndFunc

#cs
# Create a socket connected to an existing server.
#
# @param String $host The IPv4 address to connect to.
# @param Int $port The port number to connect to.
#
# @return Int The socket identifier (SocketID) or 0/-1 if an error occurred.
#ce
Func TCPConnect($host, $port)
    #native code
EndFunc

#cs
# Creates a socket listening for an incoming connection.
#
# @param String $host The IPv4 address to listen on.
# @param Int $port The port number to listen on.
# @param Int $maxPendingConnections The maximum number of connections that can be pending (queued) at a time.
#
# @return Int The socket identifier (SocketID) or 0/-1 if an error occurred.
#ce
Func TCPListen($host, $port, $maxPendingConnections = Default)
    #native code
EndFunc

#cs
# Converts an Internet name to IP address.
#
# @param String $host The Internet name to convert.
#
# @return String
#ce
Func TCPNameToIP($host)
    #native code
EndFunc

#cs
# Receives data from a connected socket.
#
# @param Int $socket The connected socket identifier (SocketID) as returned by a TCPAccept() or a TCPConnect() function.
# @param Int $maxlen The maximum number of characters to receive.
# @param Int $flag Forces the function to return binary data if set to 1 (default is 0, and will auto detect between binary/string).
# $TCP_DATA_DEFAULT (0) - (Default) will auto detect between binary/string
# $TCP_DATA_BINARY (1) - return binary data
# Constants are defined in "AutoItConstants.au3".
#
# @return String|Binary
#ce
Func TCPRecv($socket, $maxlen, $flag = 0)
    #native code
EndFunc

#cs
# Sends data on a connected socket.
#
# @param Int $socket The connected socket identifier (SocketID) as returned by a TCPConnect() function.
# @param String|Binary $data The data to send.
#
# @return Int The number of bytes sent to the connected socket.
#ce
Func TCPSend($socket, $data)
    #native code
EndFunc

#cs
# Stops TCP services.
#
# @return 0|1
#ce
Func TCPShutdown()
    #native code
EndFunc

#cs
# Stops UDP services.
#
# @return 0|1
#ce
Func UDPShutdown()
    #native code
EndFunc

#cs
# Starts TCP services.
#
# @return 0|1
#ce
Func TCPStartup()
    #native code
EndFunc

#cs
# Starts UDP services.
#
# @return 0|1
#ce
Func UDPStartup()
    #native code
EndFunc

#cs
# Returns the difference in time from a previous call to TimerInit().
#
# @param Handle $handle The handle of a timer, as returned by a previous call to TimerInit().
#
# @return Int The time difference (in milliseconds) from a previous call to TimerInit().
#ce
Func TimerDiff($handle)
    #native code
EndFunc

#cs
# Returns a handle that can be passed to TimerDiff() to calculate the difference in milliseconds.
#
# @return Handle A handle that can be passed to TimerDiff() to calculate the difference in milliseconds.
#ce
Func TimerInit()
    #native code
EndFunc

#cs
# Creates a tooltip anywhere on the screen.
#
# @param String $text The text to show in the tooltip. (An empty string clears a displaying tooltip)
# @param Int $x The horizontal position of the tooltip, in pixels.
# @param Int $y The vertical position of the tooltip, in pixels.
# @param String $title The title of the tooltip.
# @param Int $icon Pre-defined icon to show next to the title: Requires a title.
# $TIP_NOICON (0) = No icon
# $TIP_INFOICON (1) = Info icon
# $TIP_WARNINGICON (2) = Warning icon
# $TIP_ERRORICON (3) = Error Icon
# Constants are defined in "AutoItConstants.au3".
# @param Int $options Sets different options for how the tooltip will be displayed (Can be added together):
# $TIP_BALLOON (1) = Display as Balloon Tip
# $TIP_CENTER (2) = Center the tip at the x,y coordinates instead of using them for the upper left corner.
# $TIP_FORCEVISIBLE (4) = Force the tooltip to always be visible confining it to monitor borders if necessary. If multiple monitors are used, then the tooltip will "snap-to" the nearest monitor.
# Constants are defined in "AutoItConstants.au3".
#
# @return 0|1
#ce
Func ToolTip($text, $x = Default, $y = Default, $title = "", $icon = 0, $options = 0)
    #native code
EndFunc

#cs
# Creates a menuitem control for the tray.
#
# @param String $text The text to show in the menuitem.
# @param Int $menuID Allows you to create a submenu in the referenced menu. If equal -1 it will be added 'behind' the last created item.
# @param Int $menuentry Allows you to define the entry number to be created. The entries are numbered starting at 0. If equal -1 it will be added 'behind' the last created entry.
# @param Int $menuradioitem $TRAY_ITEM_NORMAL (0) = (default) create a normal menuitem.
# $TRAY_ITEM_RADIO (1) = create a menuradioitem.
# Constants are defined in TrayConstants.au3.
#
# @return Int The identifier (controlID) of the new tray menuitem or 0 on failure.
#ce
Func TrayCreateItem($text, $menuID = -1, $menuentry = -1, $menuradioitem = 0)
    #native code
EndFunc

#cs
# Creates a menu control for the tray menu.
#
# @param String $text The text to show in the menu.
# @param Int $menuID If defined, allows you to create a submenu in the referenced menu. -1 refers to first level menu.
# @param Int $menuentry Allows you to define the entry number to be created. The entries are numbered starting at 0. -1 at the bottom.
#
# @return Int The identifier (controlID) of the new tray menu or 0 on failure.
#ce
Func TrayCreateMenu($text, $menuID = -1, $menuentry = -1)
    #native code
EndFunc

#cs
# Polls the tray to see if any events have occurred.
#
# @return Int
#ce
Func TrayGetMsg()
    #native code
EndFunc

#cs
# Deletes a menu/item control from the tray menu.
#
# @param Int $controlID The identifier (controlID) of the tray menuitem to delete.
#
# @return 0|1
#ce
Func TrayItemDelete($controlID)
    #native code
EndFunc

#cs
# Returns the handle for a tray menu(item).
#
# @param Int $controlID The identifier (controlID) of the tray menuitem.
#
# @return Int The handle of the given control ID or 0 on failure.
#ce
Func TrayItemGetHandle($controlID)
    #native code
EndFunc

#cs
# Gets the current state of a control.
#
# @param Int $controlID The identifier (controlID) of the tray menuitem.
#
# @return Int
#ce
Func TrayItemGetState($controlID = Default)
    #native code
EndFunc

#cs
# Gets the itemtext of a tray menu/item control.
#
# @param Int $controlID The identifier (controlID) of the tray menuitem.
#
# @return String
#ce
Func TrayItemGetText($controlID)
    #native code
EndFunc

#cs
# Defines a user-defined function to be called when a tray item is clicked.
#
# @param Int $itemID The identifier (controlID) of the tray menuitem.
# @param String $function The name of the user function to call when the tray item is clicked.
#
# @return 0|1
#ce
Func TrayItemSetOnEvent($itemID, $function)
    #native code
EndFunc

#cs
# Sets the state of a tray menu/item control.
#
# @param Int $controlID The identifier (controlID) of the tray menuitem.
# @param Int $state The state to set.
#
# @return 0|1
#ce
Func TrayItemSetState($controlID, $state)
    #native code
EndFunc

#cs
# Sets the itemtext of a tray menu/item control.
#
# @param Int $controlID The identifier (controlID) of the tray menuitem.
# @param String $text The text to set.
#
# @return 0|1
#ce
Func TrayItemSetText($controlID, $text)
    #native code
EndFunc

#cs
# Sets the clickmode of the tray icon - what mouseclicks will display the tray menu.
#
# @param Int $flag $TRAY_CLICK_SHOW (0) = Tray menu will never be shown through a mouseclick
# $TRAY_CLICK_PRIMARYDOWN (1) = Pressing primary mouse button
# $TRAY_CLICK_PRIMARYUP (2) = Releasing primary mouse button
# $TRAY_DBLCLICK_PRIMARY (4) = Double-click primary mouse button
# $TRAY_CLICK_SECONDARYDOWN (8) = Pressing secondary mouse button
# $TRAY_CLICK_SECONDARYUP (16) = Releasing secondary mouse button
# $TRAY_DBLCLICK_SECONDARY (32) = Double-click secondary mouse button
# $TRAY_CLICK_HOVERING (64) = Hovering over the tray icon
#Constants are defined in "TrayConstants.au3"
#
# @return Void
#ce
Func TraySetClick($flag)
    #native code
EndFunc

#cs
# Loads/Sets a specified tray icon.
#
# @param String $filename The filename of the icon to load.
# @param Int $iconID The identifier if the file contains multiple icons.
#
# @return Void
#ce
Func TraySetIcon($filename = Default, $iconID = Default)
    #native code
EndFunc

#cs
# Defines a user function to be called when a special tray action happens.
#
# @param Int $specialID The special tray event identifier.
# @param String $function The name of the user function to call when the event occurs.
#
# @return 0|1
#ce
Func TraySetOnEvent($specialID, $function)
    #native code
EndFunc

#cs
# Loads/Sets a specified tray pause icon.
#
# @param String $filename The filename of the icon to load.
# @param Int $iconID The identifier if the file contains multiple icons.
#
# @return Void
#ce
Func TraySetPauseIcon($filename = Default, $iconID = Default)
    #native code
EndFunc

#cs
# Sets the state of the tray icon.
#
# @param Int $flag A combination of the following:
# $TRAY_ICONSTATE_SHOW (1) = Shows the tray icon (default)
# $TRAY_ICONSTATE_HIDE (2) = Destroys/Hides the tray icon
# $TRAY_ICONSTATE_FLASH (4) = Flashes the tray icon
# $TRAY_ICONSTATE_STOPFLASH (8) = Stops tray icon flashing
# $TRAY_ICONSTATE_RESET (16) = Resets the icon to the defaults (no flashing, default tip text)
# Constants are defined in TrayConstants.au3.
#
# @return Void
#ce
Func TraySetState($flag = 1)
    #native code
EndFunc

#cs
# (Re)Sets the tooltip text for the tray icon.
#
# @param String $text The new text to be displayed as tooltip. The length is limited - see Remarks.
#
# @return 0|1
#ce
Func TraySetToolTip($text = Default)
    #native code
EndFunc

#cs
# Displays a balloon tip from the AutoIt Icon.
#
# @param String $title The title of the tooltip. (63 characters maximum)
# @param String $text The text to show in the tooltip. (255 characters maximum)
# @param Int $timeout The time in seconds to show the tooltip. (Windows has a min and max of about 10-30 seconds but does not always honor a time in that range)
# @param Int $option  $TIP_ICONNONE (0) = No icon (default)
# $TIP_ICONASTERISK (1) = Info icon
# $TIP_ICONEXCLAMATION (2) = Warning icon
# $TIP_ICONHAND (3) = Error icon
# $TIP_NOSOUND (16) = Disable sound
# Constants are defined in TrayConstants.au3.
#
# @return Void
#ce
Func TrayTip($title, $text, $timeout, $option = 0)
    #native code
EndFunc

#cs
# Returns the size of array dimensions or the number of keys in a map.
#
# @param Array|Map $array The array to check.
# @param Int $dimension For an array - Which dimension size to return:
# $UBOUND_DIMENSIONS (0) = Number of subscripts in the array
# $UBOUND_ROWS (1) = Number of rows in the array (default)
# $UBOUND_COLUMNS (2) = Number of columns in the array
# For arrays with more than 2 dimensions, just use the corresponding integer
# For a map - this parameter is ignored and the number of keys is returned
# Constants are defined in AutoItConstants.au3.
#
# @return Int The size of the array dimension or the number of keys within a map.
#ce
Func UBound($array, $dimension = 1)
    #native code
EndFunc

#cs
# Create a socket bound to an incoming connection.
#
# @param String $host The IPv4 address to bind to.
# @param Int $port The port to bind to.
#
# @return Array $aArray[1] contains the real socket, $aArray[2] contains the specified IP address and $aArray[3] contains the port. We need this information in subsequent calls to UDPRecv(), where we pass this socket structure/array.
#ce
Func UDPBind($host, $port)
    #native code
EndFunc

#cs
# Close a UDP socket.
#
# @param Array $socketarray The socket/array as returned by a UDPBind() or UDPOpen() functions.
#
# @return 0|1
#ce
Func UDPCloseSocket($socketarray)
    #native code
EndFunc

#cs
# Open a socket connected to an existing server .
#
# @param String $host The IPv4 address to connect to.
# @param Int $port The port to connect to.
# @param Int $flag $UDP_OPEN_DEFAULT (0) - (Default) - No additional options are set.
# $UDP_OPEN_BROADCAST (1) - Allow the broadcasting on the address "255.255.255.255".
# Constants are defined in "AutoItConstants.au3".
#
# @return Array $aArray[1] contains the real socket, $aArray[2] contains the specified IP address and $aArray[3] contains the port. We need this information in subsequent calls to UDPSend(), where we pass this socket structure/array.
#ce
Func UDPOpen($host, $port, $flag = 0)
    #native code
EndFunc

#cs
# Receives data from an opened socket.
#
# @param Array $socketarray The socket/array as returned by a UDPBind() function.
# @param Int $maxlen The maximum number of characters to receive.
# @param Int $flag UDP_DATA_DEFAULT (0) - will auto detect between binary/string.
# UDP_DATA_BINARY (1) - return binary data
# $UDP_DATA_ARRAY (2) - returned in an Array : [0] data, [1] from IP, [2] from Port.
# If you want both just use 3.
# Constants are defined in "AutoItConstants.au3".
#
# @return String|Binary|Array The received data.
#ce
Func UDPRecv($socketarray, $maxlen, $flag = 0)
    #native code
EndFunc

#cs
# Sends data on an opened socket.
#
# @param Array $socketarray The socket/array as returned by a UDPOpen() function.
# @param String|Binary $data The data to send.
#
# @return Int The number of bytes sent to the connected socket.
#ce
Func UDPSend($socketarray, $data)
    #native code
EndFunc

#cs
# Returns the internal type representation of a variant.
#
# @param Mixed $variant The variant to get the type of.
#
# @return String A string representing the type of the expression.
#ce
Func VarGetType($variant)
    #native code
EndFunc

#cs
# Activates (gives focus to) a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return Handle 0 if window is not found or cannot be activated.
#ce
Func WinActivate($title, $title = "")
    #native code
EndFunc

#cs
# Checks to see if a specified window exists and is currently active.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return Handle 0 if the window is not active or cannot be found.
#ce
Func WinActive($title, $text = "")
    #native code
EndFunc

#cs
# Closes a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return 0|1
#ce
Func WinClose($title, $text = "")
    #native code
EndFunc

#cs
# Checks to see if a specified window exists.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return 0|1
#ce
Func WinExists($title, $text = "")
    #native code
EndFunc

#cs
# Flashes a window in the taskbar.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param Int $flashes The number of times to flash the window.
# @param Int $delay The delay between flashes in milliseconds.
#
# @return Void
#ce
Func WinFlash($title, $text = "", $flashes = 4, $delay = 500)
    #native code
EndFunc

#cs
# Returns the coordinates of the caret in the foreground window.
#
# @return Array $aArray[0] contains the X coordinate and $aArray[1] contains the Y coordinate.
#ce
Func WinGetCaretPos()
    #native code
EndFunc

#cs
# Retrieves the classes from a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return String The classes of the window.
#ce
Func WinGetClassList($title, $text = "")
    #native code
EndFunc

#cs
# Retrieves the size of a given window's client area.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return Array $aArray[0] contains the width and $aArray[1] contains the height.
#ce
Func WinGetClientSize($title, $text = "")
    #native code
EndFunc

#cs
# Retrieves the internal handle of a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return Handle
#ce
Func WinGetHandle($title, $text = "")
    #native code
EndFunc

#cs
# Retrieves the position and size of a given window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return Array $aArray[0] contains the X position, $aArray[1] contains the Y position, $aArray[2] contains the width and $aArray[3] contains the height.
#ce
Func WinGetPos($title, $text = "")
    #native code
EndFunc

#cs
# Retrieves the Process ID (PID) associated with a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return Int
#ce
Func WinGetProcess($title, $text = "")
    #native code
EndFunc

#cs
# Retrieves the state of a given window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return Int
#ce
Func WinGetState($title, $text = "")
    #native code
EndFunc

#cs
# Retrieves the text from a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return String
#ce
Func WinGetText($title, $text = "")
    #native code
EndFunc

#cs
# Retrieves the full title from a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return String
#ce
Func WinGetTitle($title, $text = "")
    #native code
EndFunc

#cs
# Forces a window to close.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return 1
#ce
Func WinKill($title, $text = "")
    #native code
EndFunc

#cs
# Retrieves a list of windows.
#
# If no title and text is given then all top-level windows are returned.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
#
# @return String
#ce
Func WinList($title = Default, $text = "")
    #native code
EndFunc

#cs
# Invokes a menu item of a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $item1 Text of first menu item.
# @param String $item2 Text of second menu item.
# @param String $item3 Text of third menu item.
# @param String $item4 Text of fourth menu item.
# @param String $item5 Text of fifth menu item.
# @param String $item6 Text of sixth menu item.
# @param String $item7 Text of seventh menu item.
#
# @return 1|0
#ce
Func WinMenuSelectItem($title, $text, $item1, $item2 = "", $item3 = "", $item4 = "", $item5 = "", $item6 = "", $item7 = "")
    #native code
EndFunc

#cs
# Minimizes all windows.
#
# @return Void
#ce
Func WinMinimizeAll()
    #native code
EndFunc

#cs
# Undoes a previous WinMinimizeAll function.
#
# @return Void
#ce
Func WinMinimizeAllUndo()
    #native code
EndFunc

#cs
# Moves and/or resizes a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param Int $x The x coordinate of the new position.
# @param Int $y The y coordinate of the new position.
# @param Int $width The new width of the window.
# @param Int $height The new height of the window.
# @param Int $speed The speed to move the windows in the range 1 (fastest) to 100 (slowest). If not defined the move is instantaneous.
#
# @return Handle 0 if the window was not found.
#ce
Func WinMove($title, $text, $x, $y, $width = Default, $height = Default, $speed = 0)
    #native code
EndFunc

#cs
# Change a window's "Always On Top" attribute.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param Int $flag Determines whether the window should have the "TOPMOST" flag set.
# $WINDOWS_NOONTOP (0) = remove on top flag
# $WINDOWS_ONTOP (1) = set on top flag
# Constants are defined in "AutoItConstants.au3".
#
# @return 0|1
#ce
Func WinSetOnTop($title, $text, $flag)
    #native code
EndFunc

#cs
# Shows, hides, minimizes, maximizes, or restores a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param Int $state The "show" flag of the executed program.
#
# @return 0|1
#ce
Func WinSetState($title, $text, $state)
    #native code
EndFunc

#cs
# Changes the title of a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param String $newtitle The new title of the window.
#
# @return 0|1
#ce
Func WinSetTitle($title, $text, $newtitle)
    #native code
EndFunc

#cs
# Sets the transparency of a window.
#
# @param String|hWnd $title The title/hWnd/class of the window to access. See Title special definition.
# @param String $text The text of the window to access. See Text special definition.
# @param Int $transparency The new transparency of the window in the range 0 - 255.  255 = Solid, 0 = Invisible.
#
# @return Int 0 on failure.
#ce
Func WinSetTrans($title, $text, $transparency)
    #native code
EndFunc

#cs
# Pauses execution of the script until the requested window exists.
#
# @param String $title The title of the window to wait for.
# @param String $text The text of the window to wait for.
# @param Int $timeout The maximum time to wait in seconds. 0 = infinite.
#
# @return Handle Window handle or 0 if timeout was reached.
#ce
Func WinWait($title, $text = "", $timeout = 0)
    #native code
EndFunc

#cs
# Pauses execution of the script until the requested window is active.
#
# @param String $title The title of the window to wait for.
# @param String $text The text of the window to wait for.
# @param Int $timeout The maximum time to wait in seconds. 0 = infinite.
#
# @return Handle Window handle or 0 if timeout was reached.
#ce
Func WinWaitActive($title, $text = "", $timeout = 0)
    #native code
EndFunc

#cs
# Pauses execution of the script until the requested window does not exist.
#
# @param String $title The title of the window to wait for.
# @param String $text The text of the window to wait for.
# @param Int $timeout The maximum time to wait in seconds. 0 = infinite.
#
# @return Handle Window handle or 0 if timeout was reached.
#ce
Func WinWaitClose($title, $text = "", $timeout = 0)
    #native code
EndFunc

#cs
# Pauses execution of the script until the requested window is not active.
#
# @param String $title The title of the window to wait for.
# @param String $text The text of the window to wait for.
# @param Int $timeout The maximum time to wait in seconds. 0 = infinite.
#
# @return Handle Window handle or 0 if timeout was reached.
#ce
Func WinWaitNotActive($title, $text = "", $timeout = 0)
    #native code
EndFunc

; FIXME: a au3doc type for flags?
; FIXME: a au3doc type for variables (both existing, non exesting and varaibles taht will be defined by the function)
; FIXME: a au3doc tag for setting @error and @extended macro's
; FIXME: should a au3doc type for variable references be made, or should we rely on au3 notation for this only?
