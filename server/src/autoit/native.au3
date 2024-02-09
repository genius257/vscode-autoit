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
# Remember hex notation can be used for numbers.
# BitAND() returns 1 in each bit position where all input arguments have a 1 in the corresponding position and 0 in all others.
#
# Bit operations are performed as 32-bit integers.
#
# @param Int $value1 The first number
# @param Int $value2 The second number
# @param Int $value3 The third number
# @param Int $value4 The fourth number
# @param Int $value5 The fifth number
# @param Int $value6 The sixth number
# @param Int $value7 The seventh number
# @param Int $value8 The eighth number
# @param Int $value9 The ninth number
# @param Int $value10 The tenth number
# @param Int $value11 The eleventh number
# @param Int $value12 The twelfth number
# @param Int $value13 The thirteenth number
# @param Int $value14 The fourteenth number
# @param Int $value15 The fifteenth number
# @param Int $value16 The sixteenth number
#
# @return Int32 The value of the parameters bitwise-AND'ed together.
#ce
Func BitAND($value1, $value2, $value3 = Default, $value4 = Default, $value5 = Default, $value6 = Default, $value7 = Default, $value8 = Default, $value9 = Default, $value10 = Default, $value11 = Default, $value12 = Default, $value13 = Default, $value14 = Default, $value15 = Default, $value16 = Default); FIXME: up to 255 values can be specified
    #native code
EndFunc

#cs
# Performs a bitwise NOT operation.
#
# Remember hex notation can be used for numbers.
# Remember that in 2's-complement notation, BitNOT() is functionally equivalent to adding 1 and negating the result.
# Also remember that NOT changes a 0 bit to 1 and vice-versa.
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
# Remember hex notation can be used for numbers.
# BitOR() returns 0 in each bit position where all input arguments have a 0 in the corresponding position and 1 wherever there is at least one 1-bit.
#
# Bit operations are performed as 32-bit integers.
#
# @param Int $value1 The first number
# @param Int $value2 The second number
# @param Int $value3 The third number
# @param Int $value4 The fourth number
# @param Int $value5 The fifth number
# @param Int $value6 The sixth number
# @param Int $value7 The seventh number
# @param Int $value8 The eighth number
# @param Int $value9 The ninth number
# @param Int $value10 The tenth number
# @param Int $value11 The eleventh number
# @param Int $value12 The twelfth number
# @param Int $value13 The thirteenth number
# @param Int $value14 The fourteenth number
# @param Int $value15 The fifteenth number
# @param Int $value16 The sixteenth number
#
# @return Int32 The two parameters bitwise-OR'ed together.
#ce
Func BitOR($value1, $value2, $value3 = Default, $value4 = Default, $value5 = Default, $value6 = Default, $value7 = Default, $value8 = Default, $value9 = Default, $value10 = Default, $value11 = Default, $value12 = Default, $value13 = Default, $value14 = Default, $value15 = Default, $value16 = Default); FIXME: up to 255 values can be specified
    #native code
EndFunc

#cs
# Performs a bit shifting operation, with rotation.
#
# Remember hex notation can be used for numbers.
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
# Remember hex notation can be used for numbers.
# Right shifts are equivalent to halving; left shifts to doubling.
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
# Remember hex notation can be used for numbers.
# BitXOR() returns 1 in a bit position if there are an odd number of 1's in the corresponding bit position in all the input arguments, and 0 otherwise.
#
# Bit operations are performed as 32-bit integers.
#
# @param Int $value1 The first number
# @param Int $value2 The second number
# @param Int $value3 The third number
# @param Int $value4 The fourth number
# @param Int $value5 The fifth number
# @param Int $value6 The sixth number
# @param Int $value7 The seventh number
# @param Int $value8 The eighth number
# @param Int $value9 The ninth number
# @param Int $value10 The tenth number
# @param Int $value11 The eleventh number
# @param Int $value12 The twelfth number
# @param Int $value13 The thirteenth number
# @param Int $value14 The fourteenth number
# @param Int $value15 The fifteenth number
# @param Int $value16 The sixteenth number
#
# @return Int32 The value of the parameters bitwise-XOR'ed together.
#ce
Func BitXOR($value1, $value2, $value3 = Default, $value4 = Default, $value5 = Default, $value6 = Default, $value7 = Default, $value8 = Default, $value9 = Default, $value10 = Default, $value11 = Default, $value12 = Default, $value13 = Default, $value14 = Default, $value15 = Default, $value16 = Default); FIXME: up to 255 values can be specified
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
#
# @return Mixed The return value of the called function.
#ce
Func Call($function, $param_1 = Default, $param_2 = Default, $param_3 = Default, $param_4 = Default, $param_5 = Default, $param_6 = Default, $param_7 = Default, $param_8 = Default, $param_9 = Default, $param_10 = Default)
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
# Chr(48) == "0", Chr(57) == "9", Chr(65) == "A", Chr(90) == "Z", Chr(97) == "a", Chr(122) == "z", etc.
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
# Returns the control's current text.
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
# Returns the control's current text.
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
# 1° = pi / 180 radians.
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
# @param String $type1 The type of the first parameter.
# @param Mixed $param1 The value of the first parameter.
# @param String $type2 The type of the second parameter.
# @param Mixed $param2 The value of the second parameter.
# @param String $type3 The type of the third parameter.
# @param Mixed $param3 The value of the third parameter.
# @param String $type4 The type of the fourth parameter.
# @param Mixed $param4 The value of the fourth parameter.
# @param String $type5 The type of the fifth parameter.
# @param Mixed $param5 The value of the fifth parameter.
# @param String $type6 The type of the sixth parameter.
# @param Mixed $param6 The value of the sixth parameter.
# @param String $type7 The type of the seventh parameter.
# @param Mixed $param7 The value of the seventh parameter.
# @param String $type8 The type of the eighth parameter.
# @param Mixed $param8 The value of the eighth parameter.
# @param String $type9 The type of the ninth parameter.
# @param Mixed $param9 The value of the ninth parameter.
# @param String $type10 The type of the tenth parameter.
# @param Mixed $param10 The value of the tenth parameter.
#
# @return Array
#ce
Func DllCall($dll, $return_type, $function, $type1 = Default, $param1 = Default, $type2 = Default, $param2 = Default, $type3 = Default, $param3 = Default, $type4 = Default, $param4 = Default, $type5 = Default, $param5 = Default, $type6 = Default, $param6 = Default, $type7 = Default, $param7 = Default, $type8 = Default, $param8 = Default, $type9 = Default, $param9 = Default, $type10 = Default, $param10 = Default)
    #native code
EndFunc;TODO: support DLLCALL param types (currently shown as a table in official docs)


; FIXME: a au3doc type for flags?
; FIXME: a au3doc type for variables (both existing, non exesting and varaibles taht will be defined by the function)
; FIXME: a au3doc tag for setting @error and @extended macro's
; FIXME: should a au3doc type for variable references be made, or should we rely on au3 notation for this only?