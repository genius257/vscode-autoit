#cs
# AutoIt vscode file for providing AutoIt3 built-in function intellisense.
#ce

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
# The result of 4 * ATan(1) is pi.
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

; ...

Func DllCall($dll, $return_type, $function, $type1, $param1)
    #native code
EndFunc

; FIXME: a au3doc type for flags?
; FIXME: a au3doc type for variables (both existing, non exesting and varaibles taht will be defined by the function)
; FIXME: a au3doc tag for setting @error and @extended macro's
; FIXME: should a au3doc type for variable references be made, or should we rely on au3 notation for this only?