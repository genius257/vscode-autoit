import { CompletionItemKind } from "vscode-languageserver";

export type documentation = {
    title: string,
    detail: string,
    documentation: string,
    kind: CompletionItemKind,
}

export type documentationCollection = {
    [key: string]: documentation,
}

export default {
    '@appdatacommondir': {
        title: '@AppDataCommonDir',
        detail: '@AppDataCommonDir',
        documentation: 'Path to Application Data',
        kind: CompletionItemKind.Constant
    },
    '@appdatadir': {
        title: '@AppDataDir',
        detail: '@AppDataDir',
        documentation: 'Path to current user\'s Roaming Application Data',
        kind: CompletionItemKind.Constant
    },
    '@autoitexe': {
        title: '@AutoItExe',
        detail: '@AutoItExe',
        documentation: 'The full path and filename of the AutoIt executable currently running. For compiled scripts it is the path of the compiled script; for .a3x and .au3 files it is the path of the interpreter running the file.',
        kind: CompletionItemKind.Constant
    },
    '@autoitpid': {
        title: '@AutoItPID',
        detail: '@AutoItPID',
        documentation: 'Process identifier (PID) of the current script.',
        kind: CompletionItemKind.Constant
    },
    '@autoitversion': {
        title: '@AutoItVersion',
        detail: '@AutoItVersion',
        documentation: 'Version number of AutoIt such as 3.3.10.2',
        kind: CompletionItemKind.Constant
    },
    '@autoitx64': {
        title: '@AutoItX64',
        detail: '@AutoItX64',
        documentation: 'Returns 1 if the script is running under the native x64 version of AutoIt.',
        kind: CompletionItemKind.Constant
    },
    '@com_eventobj': {
        title: '@COM_EventObj',
        detail: '@COM_EventObj',
        documentation: 'Object the COM event is being fired on. Only valid in a COM event function.',
        kind: CompletionItemKind.Constant
    },
    '@commonfilesdir': {
        title: '@CommonFilesDir',
        detail: '@CommonFilesDir',
        documentation: 'Path to Common Files folder',
        kind: CompletionItemKind.Constant
    },
    '@compiled': {
        title: '@Compiled',
        detail: '@Compiled',
        documentation: 'Returns 1 if script is a compiled executable or an .a3x file; returns 0 if an .au3 file.',
        kind: CompletionItemKind.Constant
    },
    '@computername': {
        title: '@ComputerName',
        detail: '@ComputerName',
        documentation: 'Computer\'s network name.',
        kind: CompletionItemKind.Constant
    },
    '@comspec': {
        title: '@ComSpec',
        detail: '@ComSpec',
        documentation: 'Value of %COMSPEC%, the SPECified secondary COMmand interpreter;',
        kind: CompletionItemKind.Constant
    },
    '@cpuarch': {
        title: '@CPUArch',
        detail: '@CPUArch',
        documentation: 'Returns "X86" when the CPU is a 32-bit CPU and "X64" when the CPU is 64-bit.',
        kind: CompletionItemKind.Constant
    },
    '@cr': {
        title: '@CR',
        detail: '@CR',
        documentation: 'Carriage return,',
        kind: CompletionItemKind.Constant
    },
    '@crlf': {
        title: '@CRLF',
        detail: '@CRLF',
        documentation: '@CR &amp; @LF; typically used for line breaks.',
        kind: CompletionItemKind.Constant
    },
    '@desktopcommondir': {
        title: '@DesktopCommonDir',
        detail: '@DesktopCommonDir',
        documentation: 'Path to Desktop',
        kind: CompletionItemKind.Constant
    },
    '@desktopdepth': {
        title: '@DesktopDepth',
        detail: '@DesktopDepth',
        documentation: 'Depth of the primary display in bits per pixel.',
        kind: CompletionItemKind.Constant
    },
    '@desktopdir': {
        title: '@DesktopDir',
        detail: '@DesktopDir',
        documentation: 'Path to current user\'s Desktop',
        kind: CompletionItemKind.Constant
    },
    '@desktopheight': {
        title: '@DesktopHeight',
        detail: '@DesktopHeight',
        documentation: 'Height of the primary display in pixels. (Vertical resolution)',
        kind: CompletionItemKind.Constant
    },
    '@desktoprefresh': {
        title: '@DesktopRefresh',
        detail: '@DesktopRefresh',
        documentation: 'Refresh rate of the primary display in hertz.',
        kind: CompletionItemKind.Constant
    },
    '@desktopwidth': {
        title: '@DesktopWidth',
        detail: '@DesktopWidth',
        documentation: 'Width of the primary display in pixels. (Horizontal resolution)',
        kind: CompletionItemKind.Constant
    },
    '@documentscommondir': {
        title: '@DocumentsCommonDir',
        detail: '@DocumentsCommonDir',
        documentation: 'Path to Documents',
        kind: CompletionItemKind.Constant
    },
    '@error': {
        title: '@error',
        detail: '@error',
        documentation: 'Status of the error flag. See the function',
        kind: CompletionItemKind.Constant
    },
    '@exitcode': {
        title: '@exitCode',
        detail: '@exitCode',
        documentation: 'Exit code as set by',
        kind: CompletionItemKind.Constant
    },
    '@exitmethod': {
        title: '@exitMethod',
        detail: '@exitMethod',
        documentation: 'Exit method. See the function',
        kind: CompletionItemKind.Constant
    },
    '@extended': {
        title: '@extended',
        detail: '@extended',
        documentation: 'Extended function return - used in certain functions such as',
        kind: CompletionItemKind.Constant
    },
    '@favoritescommondir': {
        title: '@FavoritesCommonDir',
        detail: '@FavoritesCommonDir',
        documentation: 'Path to Favorites',
        kind: CompletionItemKind.Constant
    },
    '@favoritesdir': {
        title: '@FavoritesDir',
        detail: '@FavoritesDir',
        documentation: 'Path to current user\'s Favorites',
        kind: CompletionItemKind.Constant
    },
    '@gui_ctrlhandle': {
        title: '@GUI_CtrlHandle',
        detail: '@GUI_CtrlHandle',
        documentation: 'Last click GUI Control handle. Only valid in an event Function. See the',
        kind: CompletionItemKind.Constant
    },
    '@gui_ctrlid': {
        title: '@GUI_CtrlId',
        detail: '@GUI_CtrlId',
        documentation: 'Last click GUI Control identifier. Only valid in an event Function. See the',
        kind: CompletionItemKind.Constant
    },
    '@gui_dragfile': {
        title: '@GUI_DragFile',
        detail: '@GUI_DragFile',
        documentation: 'Filename of the file being dropped. Only valid on Drop Event. See the',
        kind: CompletionItemKind.Constant
    },
    '@gui_dragid': {
        title: '@GUI_DragId',
        detail: '@GUI_DragId',
        documentation: 'Drag GUI Control identifier. Only valid on Drop Event. See the',
        kind: CompletionItemKind.Constant
    },
    '@gui_dropid': {
        title: '@GUI_DropId',
        detail: '@GUI_DropId',
        documentation: 'Drop GUI Control identifier. Only valid on Drop Event. See the',
        kind: CompletionItemKind.Constant
    },
    '@gui_winhandle': {
        title: '@GUI_WinHandle',
        detail: '@GUI_WinHandle',
        documentation: 'Last click GUI window handle. Only valid in an event Function. See the',
        kind: CompletionItemKind.Constant
    },
    '@homedrive': {
        title: '@HomeDrive',
        detail: '@HomeDrive',
        documentation: 'Drive letter of drive containing current user\'s home directory.',
        kind: CompletionItemKind.Constant
    },
    '@homepath': {
        title: '@HomePath',
        detail: '@HomePath',
        documentation: 'Directory part of current user\'s home directory. To get the full path, use in conjunction with @HomeDrive.',
        kind: CompletionItemKind.Constant
    },
    '@homeshare': {
        title: '@HomeShare',
        detail: '@HomeShare',
        documentation: 'Server and share name containing current user\'s home directory.',
        kind: CompletionItemKind.Constant
    },
    '@hotkeypressed': {
        title: '@HotKeyPressed',
        detail: '@HotKeyPressed',
        documentation: 'Last hotkey pressed. See the',
        kind: CompletionItemKind.Constant
    },
    '@hour': {
        title: '@HOUR',
        detail: '@HOUR',
        documentation: 'Hours value of clock in 24-hour format. Range is 00 to 23',
        kind: CompletionItemKind.Constant
    },
    '@ipaddress1': {
        title: '@IPAddress1',
        detail: '@IPAddress1',
        documentation: 'IP address of first network adapter. Tends to return 127.0.0.1 on some computers.',
        kind: CompletionItemKind.Constant
    },
    '@ipaddress2': {
        title: '@IPAddress2',
        detail: '@IPAddress2',
        documentation: 'IP address of second network adapter. Returns 0.0.0.0 if not applicable.',
        kind: CompletionItemKind.Constant
    },
    '@ipaddress3': {
        title: '@IPAddress3',
        detail: '@IPAddress3',
        documentation: 'IP address of third network adapter. Returns 0.0.0.0 if not applicable.',
        kind: CompletionItemKind.Constant
    },
    '@ipaddress4': {
        title: '@IPAddress4',
        detail: '@IPAddress4',
        documentation: 'IP address of fourth network adapter. Returns 0.0.0.0 if not applicable.',
        kind: CompletionItemKind.Constant
    },
    '@kblayout': {
        title: '@KBLayout',
        detail: '@KBLayout',
        documentation: 'Returns code denoting Keyboard Layout.  See',
        kind: CompletionItemKind.Constant
    },
    '@lf': {
        title: '@LF',
        detail: '@LF',
        documentation: 'Line feed,',
        kind: CompletionItemKind.Constant
    },
    '@localappdatadir': {
        title: '@LocalAppDataDir',
        detail: '@LocalAppDataDir',
        documentation: 'Path to current user\'s Local Application Data',
        kind: CompletionItemKind.Constant
    },
    '@logondnsdomain': {
        title: '@LogonDNSDomain',
        detail: '@LogonDNSDomain',
        documentation: 'Logon DNS Domain.',
        kind: CompletionItemKind.Constant
    },
    '@logondomain': {
        title: '@LogonDomain',
        detail: '@LogonDomain',
        documentation: 'Logon Domain.',
        kind: CompletionItemKind.Constant
    },
    '@logonserver': {
        title: '@LogonServer',
        detail: '@LogonServer',
        documentation: 'Logon server.',
        kind: CompletionItemKind.Constant
    },
    '@mday': {
        title: '@MDAY',
        detail: '@MDAY',
        documentation: 'Current day of month. Range is 01 to 31',
        kind: CompletionItemKind.Constant
    },
    '@min': {
        title: '@MIN',
        detail: '@MIN',
        documentation: 'Minutes value of clock. Range is 00 to 59',
        kind: CompletionItemKind.Constant
    },
    '@mon': {
        title: '@MON',
        detail: '@MON',
        documentation: 'Current month. Range is 01 to 12',
        kind: CompletionItemKind.Constant
    },
    '@msec': {
        title: '@MSEC',
        detail: '@MSEC',
        documentation: 'Milliseconds value of clock. Range is 000 to 999. The update frequency of this value depends on the timer resolution of the hardware and may not update every millisecond.',
        kind: CompletionItemKind.Constant
    },
    '@muilang': {
        title: '@MUILang',
        detail: '@MUILang',
        documentation: 'Returns code denoting Multi Language if available (Vista is OK by default).  See',
        kind: CompletionItemKind.Constant
    },
    '@mydocumentsdir': {
        title: '@MyDocumentsDir',
        detail: '@MyDocumentsDir',
        documentation: 'Path to My Documents target',
        kind: CompletionItemKind.Constant
    },
    '@numparams': {
        title: '@NumParams',
        detail: '@NumParams',
        documentation: 'Number of parameters used in calling the user function.',
        kind: CompletionItemKind.Constant
    },
    '@osarch': {
        title: '@OSArch',
        detail: '@OSArch',
        documentation: 'Returns one of the following: "X86", "IA64", "X64" - this is the architecture type of the currently running operating system.',
        kind: CompletionItemKind.Constant
    },
    '@osbuild': {
        title: '@OSBuild',
        detail: '@OSBuild',
        documentation: 'Returns the OS build number. For example, Windows 2003 Server returns 3790',
        kind: CompletionItemKind.Constant
    },
    '@oslang': {
        title: '@OSLang',
        detail: '@OSLang',
        documentation: 'Returns code denoting OS Language.  See',
        kind: CompletionItemKind.Constant
    },
    '@osservicepack': {
        title: '@OSServicePack',
        detail: '@OSServicePack',
        documentation: 'Service pack info in the form of "Service Pack 3".',
        kind: CompletionItemKind.Constant
    },
    '@ostype': {
        title: '@OSType',
        detail: '@OSType',
        documentation: 'Returns "WIN32_NT" for XP/2003/Vista/2008/Win7/2008R2/Win8/2012/Win8.1/2012R2.',
        kind: CompletionItemKind.Constant
    },
    '@osversion': {
        title: '@OSVersion',
        detail: '@OSVersion',
        documentation: 'Returns one of the following: "WIN_11", "WIN_10", "WIN_81", "WIN_8", "WIN_7", "WIN_VISTA", "WIN_XP", "WIN_XPe",',
        kind: CompletionItemKind.Constant
    },
    '@programfilesdir': {
        title: '@ProgramFilesDir',
        detail: '@ProgramFilesDir',
        documentation: 'Path to Program Files folder',
        kind: CompletionItemKind.Constant
    },
    '@programscommondir': {
        title: '@ProgramsCommonDir',
        detail: '@ProgramsCommonDir',
        documentation: 'Path to Start Menu\'s Programs folder',
        kind: CompletionItemKind.Constant
    },
    '@programsdir': {
        title: '@ProgramsDir',
        detail: '@ProgramsDir',
        documentation: 'Path to current user\'s Programs (folder on Start Menu)',
        kind: CompletionItemKind.Constant
    },
    '@scriptdir': {
        title: '@ScriptDir',
        detail: '@ScriptDir',
        documentation: 'Directory containing the running script. Only includes a trailing backslash when the script is located in the root of a drive.',
        kind: CompletionItemKind.Constant
    },
    '@scriptfullpath': {
        title: '@ScriptFullPath',
        detail: '@ScriptFullPath',
        documentation: 'Equivalent to @ScriptDir &amp; "\\" &amp; @ScriptName',
        kind: CompletionItemKind.Constant
    },
    '@scriptlinenumber': {
        title: '@ScriptLineNumber',
        detail: '@ScriptLineNumber',
        documentation: 'Line number being executed - useful for debug statements (e.g. location of function call). Only significant in uncompiled scripts - note that #include files return their internal line numbering',
        kind: CompletionItemKind.Constant
    },
    '@scriptname': {
        title: '@ScriptName',
        detail: '@ScriptName',
        documentation: 'Filename of the running script.',
        kind: CompletionItemKind.Constant
    },
    '@sec': {
        title: '@SEC',
        detail: '@SEC',
        documentation: 'Seconds value of clock. Range is 00 to 59',
        kind: CompletionItemKind.Constant
    },
    '@startmenucommondir': {
        title: '@StartMenuCommonDir',
        detail: '@StartMenuCommonDir',
        documentation: 'Path to Start Menu folder',
        kind: CompletionItemKind.Constant
    },
    '@startmenudir': {
        title: '@StartMenuDir',
        detail: '@StartMenuDir',
        documentation: 'Path to current user\'s Start Menu',
        kind: CompletionItemKind.Constant
    },
    '@startupcommondir': {
        title: '@StartupCommonDir',
        detail: '@StartupCommonDir',
        documentation: 'Path to Startup folder',
        kind: CompletionItemKind.Constant
    },
    '@startupdir': {
        title: '@StartupDir',
        detail: '@StartupDir',
        documentation: 'current user\'s Startup folder',
        kind: CompletionItemKind.Constant
    },
    '@sw_disable': {
        title: '@SW_DISABLE',
        detail: '@SW_DISABLE',
        documentation: 'Disables the window.',
        kind: CompletionItemKind.Constant
    },
    '@sw_enable': {
        title: '@SW_ENABLE',
        detail: '@SW_ENABLE',
        documentation: 'Enables the window.',
        kind: CompletionItemKind.Constant
    },
    '@sw_hide': {
        title: '@SW_HIDE',
        detail: '@SW_HIDE',
        documentation: 'Hides the window and activates another window.',
        kind: CompletionItemKind.Constant
    },
    '@sw_lock': {
        title: '@SW_LOCK',
        detail: '@SW_LOCK',
        documentation: 'Lock the window to avoid repainting.',
        kind: CompletionItemKind.Constant
    },
    '@sw_maximize': {
        title: '@SW_MAXIMIZE',
        detail: '@SW_MAXIMIZE',
        documentation: 'Activates the window and displays it as a maximized window.',
        kind: CompletionItemKind.Constant
    },
    '@sw_minimize': {
        title: '@SW_MINIMIZE',
        detail: '@SW_MINIMIZE',
        documentation: 'Minimizes the specified window and activates the next top-level window in the Z order.',
        kind: CompletionItemKind.Constant
    },
    '@sw_restore': {
        title: '@SW_RESTORE',
        detail: '@SW_RESTORE',
        documentation: 'Activates and displays the window. If the window is minimized or maximized, the system restores it to its original size and position. An application should specify this flag when restoring a minimized window.',
        kind: CompletionItemKind.Constant
    },
    '@sw_show': {
        title: '@SW_SHOW',
        detail: '@SW_SHOW',
        documentation: 'Activates the window and displays it in its current size and position.',
        kind: CompletionItemKind.Constant
    },
    '@sw_showdefault': {
        title: '@SW_SHOWDEFAULT',
        detail: '@SW_SHOWDEFAULT',
        documentation: 'Sets the show state based on the SW_ value specified by the program that started the application.',
        kind: CompletionItemKind.Constant
    },
    '@sw_showmaximized': {
        title: '@SW_SHOWMAXIMIZED',
        detail: '@SW_SHOWMAXIMIZED',
        documentation: 'Activates the window and displays it as a maximized window.',
        kind: CompletionItemKind.Constant
    },
    '@sw_showminimized': {
        title: '@SW_SHOWMINIMIZED',
        detail: '@SW_SHOWMINIMIZED',
        documentation: 'Activates the window and displays it as a minimized window.',
        kind: CompletionItemKind.Constant
    },
    '@sw_showminnoactive': {
        title: '@SW_SHOWMINNOACTIVE',
        detail: '@SW_SHOWMINNOACTIVE',
        documentation: 'Displays the window as a minimized window. This value is similar to @SW_SHOWMINIMIZED, except the window is not activated.',
        kind: CompletionItemKind.Constant
    },
    '@sw_showna': {
        title: '@SW_SHOWNA',
        detail: '@SW_SHOWNA',
        documentation: 'Displays the window in its current size and position. This value is similar to @SW_SHOW, except the window is not activated.',
        kind: CompletionItemKind.Constant
    },
    '@sw_shownoactivate': {
        title: '@SW_SHOWNOACTIVATE',
        detail: '@SW_SHOWNOACTIVATE',
        documentation: 'Displays a window in its most recent size and position. This value is similar to @SW_SHOWNORMAL, except the window is not activated.',
        kind: CompletionItemKind.Constant
    },
    '@sw_shownormal': {
        title: '@SW_SHOWNORMAL',
        detail: '@SW_SHOWNORMAL',
        documentation: 'Activates and displays a window. If the window is minimized or maximized, the system restores it to its original size and position. An application should specify this flag when displaying the window for the first time.',
        kind: CompletionItemKind.Constant
    },
    '@sw_unlock': {
        title: '@SW_UNLOCK',
        detail: '@SW_UNLOCK',
        documentation: 'Unlock window to allow painting.',
        kind: CompletionItemKind.Constant
    },
    '@systemdir': {
        title: '@SystemDir',
        detail: '@SystemDir',
        documentation: 'Path to the Windows\' System (or System32) folder.',
        kind: CompletionItemKind.Constant
    },
    '@tab': {
        title: '@TAB',
        detail: '@TAB',
        documentation: 'Tab character,',
        kind: CompletionItemKind.Constant
    },
    '@tempdir': {
        title: '@TempDir',
        detail: '@TempDir',
        documentation: 'Path to the temporary files folder.',
        kind: CompletionItemKind.Constant
    },
    '@tray_id': {
        title: '@TRAY_ID',
        detail: '@TRAY_ID',
        documentation: 'Last clicked item identifier during a',
        kind: CompletionItemKind.Constant
    },
    '@trayiconflashing': {
        title: '@TrayIconFlashing',
        detail: '@TrayIconFlashing',
        documentation: 'Returns 1 if tray icon is flashing; otherwise, returns 0.',
        kind: CompletionItemKind.Constant
    },
    '@trayiconvisible': {
        title: '@TrayIconVisible',
        detail: '@TrayIconVisible',
        documentation: 'Returns 1 if tray icon is visible; otherwise, returns 0.',
        kind: CompletionItemKind.Constant
    },
    '@username': {
        title: '@UserName',
        detail: '@UserName',
        documentation: 'ID of the currently logged on user.',
        kind: CompletionItemKind.Constant
    },
    '@userprofiledir': {
        title: '@UserProfileDir',
        detail: '@UserProfileDir',
        documentation: 'Path to current user\'s Profile folder.',
        kind: CompletionItemKind.Constant
    },
    '@wday': {
        title: '@WDAY',
        detail: '@WDAY',
        documentation: 'Numeric day of week. Range is 1 to 7 which corresponds to Sunday through Saturday.',
        kind: CompletionItemKind.Constant
    },
    '@windowsdir': {
        title: '@WindowsDir',
        detail: '@WindowsDir',
        documentation: 'Path to Windows folder',
        kind: CompletionItemKind.Constant
    },
    '@workingdir': {
        title: '@WorkingDir',
        detail: '@WorkingDir',
        documentation: 'Current/active working directory. Only includes a trailing backslash when the script is located in the root of a drive.',
        kind: CompletionItemKind.Constant
    },
    '@yday': {
        title: '@YDAY',
        detail: '@YDAY',
        documentation: 'Current day of year. Range is 001 to 366 (or 001 to 365 if not a leap year)',
        kind: CompletionItemKind.Constant
    },
    '@year': {
        title: '@YEAR',
        detail: '@YEAR',
        documentation: 'Current four-digit year',
        kind: CompletionItemKind.Constant
    },
    abs: {
        title: 'Abs',
        detail: 'Abs ( expression )',
        documentation: 'Calculates the absolute value of a number.',
        kind: CompletionItemKind.Function
    },
    acos: {
        title: 'ACos',
        detail: 'ACos ( expression )',
        documentation: 'Calculates the arcCosine of a number.',
        kind: CompletionItemKind.Function
    },
    adlibregister: {
        title: 'AdlibRegister',
        detail: 'AdlibRegister ( "function" [, time = 250] )',
        documentation: 'Registers an Adlib function.',
        kind: CompletionItemKind.Function
    },
    adlibunregister: {
        title: 'AdlibUnRegister',
        detail: 'AdlibUnRegister ( ["function"] )',
        documentation: 'Unregisters an adlib function.',
        kind: CompletionItemKind.Function
    },
    asc: {
        title: 'Asc',
        detail: 'Asc ( "char" )',
        documentation: 'Returns the ASCII code of a character.',
        kind: CompletionItemKind.Function
    },
    ascw: {
        title: 'AscW',
        detail: 'AscW ( "char" )',
        documentation: 'Returns the unicode code of a character.',
        kind: CompletionItemKind.Function
    },
    asin: {
        title: 'ASin',
        detail: 'ASin ( expression )',
        documentation: 'Calculates the arcsine of a number.',
        kind: CompletionItemKind.Function
    },
    assign: {
        title: 'Assign',
        detail: 'Assign ( "varname", "data" [, flag = 0] )',
        documentation: 'Assigns a variable by name with the data.',
        kind: CompletionItemKind.Function
    },
    atan: {
        title: 'ATan',
        detail: 'ATan ( expression )',
        documentation: 'Calculates the arctangent of a number.',
        kind: CompletionItemKind.Function
    },
    autoitsetoption: {
        title: 'AutoItSetOption',
        detail: 'AutoItSetOption ( "option" [, param] )',
        documentation: 'Changes the operation of various AutoIt functions/parameters.',
        kind: CompletionItemKind.Function
    },
    autoitwingettitle: {
        title: 'AutoItWinGetTitle',
        detail: 'AutoItWinGetTitle (  )',
        documentation: 'Retrieves the title of the AutoIt window.',
        kind: CompletionItemKind.Function
    },
    autoitwinsettitle: {
        title: 'AutoItWinSetTitle',
        detail: 'AutoItWinSetTitle ( "newtitle" )',
        documentation: 'Changes the title of the AutoIt window.',
        kind: CompletionItemKind.Function
    },
    beep: {
        title: 'Beep',
        detail: 'Beep ( [Frequency = 500 [, Duration = 1000]] )',
        documentation: 'Plays back a beep to the user.',
        kind: CompletionItemKind.Function
    },
    binary: {
        title: 'Binary',
        detail: 'Binary ( expression )',
        documentation: 'Returns the binary representation of an expression.',
        kind: CompletionItemKind.Function
    },
    binarylen: {
        title: 'BinaryLen',
        detail: 'BinaryLen ( binary )',
        documentation: 'Returns the number of bytes in a binary variant.',
        kind: CompletionItemKind.Function
    },
    binarymid: {
        title: 'BinaryMid',
        detail: 'BinaryMid ( binary, start [, count] )',
        documentation: 'Extracts a number of bytes from a binary variant.',
        kind: CompletionItemKind.Function
    },
    binarytostring: {
        title: 'BinaryToString',
        detail: 'BinaryToString ( expression [, flag = 1] )',
        documentation: 'Converts a binary variant into a string.',
        kind: CompletionItemKind.Function
    },
    bitand: {
        title: 'BitAND',
        detail: 'BitAND ( value1, value2 [, value n] )',
        documentation: 'Performs a bitwise AND operation.',
        kind: CompletionItemKind.Function
    },
    bitnot: {
        title: 'BitNOT',
        detail: 'BitNOT ( value )',
        documentation: 'Performs a bitwise NOT operation.',
        kind: CompletionItemKind.Function
    },
    bitor: {
        title: 'BitOR',
        detail: 'BitOR ( value1, value2 [, value n] )',
        documentation: 'Performs a bitwise OR operation.',
        kind: CompletionItemKind.Function
    },
    bitrotate: {
        title: 'BitRotate',
        detail: 'BitRotate ( value [, shift = 1 [, size = "W"]] )',
        documentation: 'Performs a bit shifting operation, with rotation.',
        kind: CompletionItemKind.Function
    },
    bitshift: {
        title: 'BitShift',
        detail: 'BitShift ( value, shift )',
        documentation: 'Performs a bit shifting operation.',
        kind: CompletionItemKind.Function
    },
    bitxor: {
        title: 'BitXOR',
        detail: 'BitXOR ( value1, value2 [, value n] )',
        documentation: 'Performs a bitwise exclusive OR (XOR) operation.',
        kind: CompletionItemKind.Function
    },
    blockinput: {
        title: 'BlockInput',
        detail: 'BlockInput ( flag )',
        documentation: 'Disable/enable the mouse and keyboard.',
        kind: CompletionItemKind.Function
    },
    break: {
        title: 'Break',
        detail: 'Break ( mode )',
        documentation: 'Enables or disables the users\' ability to exit a script from the tray icon menu.',
        kind: CompletionItemKind.Function
    },
    call: {
        title: 'Call',
        detail: 'Call ( "function" [, param_1 [, param_2 [, param_N]]] )',
        documentation: 'Calls a user-defined or built-in function contained in first parameter.',
        kind: CompletionItemKind.Function
    },
    cdtray: {
        title: 'CDTray',
        detail: 'CDTray ( "drive", "status" )',
        documentation: 'Opens or closes the CD tray.',
        kind: CompletionItemKind.Function
    },
    ceiling: {
        title: 'Ceiling',
        detail: 'Ceiling ( expression )',
        documentation: 'Returns a number rounded up to the next integer.',
        kind: CompletionItemKind.Function
    },
    chr: {
        title: 'Chr',
        detail: 'Chr ( ASCIIcode )',
        documentation: 'Returns a character corresponding to an ASCII code.',
        kind: CompletionItemKind.Function
    },
    chrw: {
        title: 'ChrW',
        detail: 'ChrW ( UNICODEcode )',
        documentation: 'Returns a character corresponding to a unicode code.',
        kind: CompletionItemKind.Function
    },
    clipget: {
        title: 'ClipGet',
        detail: 'ClipGet (  )',
        documentation: 'Retrieves text from the clipboard.',
        kind: CompletionItemKind.Function
    },
    clipput: {
        title: 'ClipPut',
        detail: 'ClipPut ( "value" )',
        documentation: 'Writes text to the clipboard.',
        kind: CompletionItemKind.Function
    },
    consoleread: {
        title: 'ConsoleRead',
        detail: 'ConsoleRead ( [peek = False [, binary = False]] )',
        documentation: 'Read from the STDIN stream of the AutoIt script process.',
        kind: CompletionItemKind.Function
    },
    consolewrite: {
        title: 'ConsoleWrite',
        detail: 'ConsoleWrite ( "data" )',
        documentation: 'Writes data to the STDOUT stream. Some text editors can read this stream as can other programs which may be expecting data on this stream.',
        kind: CompletionItemKind.Function
    },
    consolewriteerror: {
        title: 'ConsoleWriteError',
        detail: 'ConsoleWriteError ( "data" )',
        documentation: 'Writes data to the STDERR stream. Some text editors can read this stream as can other programs which may be expecting data on this stream.',
        kind: CompletionItemKind.Function
    },
    controlclick: {
        title: 'ControlClick',
        detail: 'ControlClick ( "title", "text", controlID [, button = "left" [, clicks = 1 [, x [, y]]]] )',
        documentation: 'Sends a mouse click command to a given control.',
        kind: CompletionItemKind.Function
    },
    controlcommand: {
        title: 'ControlCommand',
        detail: 'ControlCommand ( "title", "text", controlID, "command" [, "option"] )',
        documentation: 'Sends a command to a control.',
        kind: CompletionItemKind.Function
    },
    controldisable: {
        title: 'ControlDisable',
        detail: 'ControlDisable ( "title", "text", controlID )',
        documentation: 'Disables or "grays-out" a control.',
        kind: CompletionItemKind.Function
    },
    controlenable: {
        title: 'ControlEnable',
        detail: 'ControlEnable ( "title", "text", controlID )',
        documentation: 'Enables a "grayed-out" control.',
        kind: CompletionItemKind.Function
    },
    controlfocus: {
        title: 'ControlFocus',
        detail: 'ControlFocus ( "title", "text", controlID )',
        documentation: 'Sets input focus to a given control on a window.',
        kind: CompletionItemKind.Function
    },
    controlgetfocus: {
        title: 'ControlGetFocus',
        detail: 'ControlGetFocus ( "title" [, "text"] )',
        documentation: 'Returns the ControlRef# of the control that has keyboard focus within a specified window.',
        kind: CompletionItemKind.Function
    },
    controlgethandle: {
        title: 'ControlGetHandle',
        detail: 'ControlGetHandle ( "title", "text", controlID )',
        documentation: 'Retrieves the internal handle of a control.',
        kind: CompletionItemKind.Function
    },
    controlgetpos: {
        title: 'ControlGetPos',
        detail: 'ControlGetPos ( "title", "text", controlID )',
        documentation: 'Retrieves the position and size of a control relative to its window.',
        kind: CompletionItemKind.Function
    },
    controlgettext: {
        title: 'ControlGetText',
        detail: 'ControlGetText ( "title", "text", controlID )',
        documentation: 'Retrieves text from a control.',
        kind: CompletionItemKind.Function
    },
    controlhide: {
        title: 'ControlHide',
        detail: 'ControlHide ( "title", "text", controlID )',
        documentation: 'Hides a control.',
        kind: CompletionItemKind.Function
    },
    controllistview: {
        title: 'ControlListView',
        detail: 'ControlListView ( "title", "text", controlID, "command" [, option1 [, option2]] )',
        documentation: 'Sends a command to a ListView32 control.',
        kind: CompletionItemKind.Function
    },
    controlmove: {
        title: 'ControlMove',
        detail: 'ControlMove ( "title", "text", controlID, x, y [, width [, height]] )',
        documentation: 'Moves a control within a window.',
        kind: CompletionItemKind.Function
    },
    controlsend: {
        title: 'ControlSend',
        detail: 'ControlSend ( "title", "text", controlID, "string" [, flag = 0] )',
        documentation: 'Sends a string of characters to a control.',
        kind: CompletionItemKind.Function
    },
    controlsettext: {
        title: 'ControlSetText',
        detail: 'ControlSetText ( "title", "text", controlID, "new text" [, flag = 0] )',
        documentation: 'Sets text of a control.',
        kind: CompletionItemKind.Function
    },
    controlshow: {
        title: 'ControlShow',
        detail: 'ControlShow ( "title", "text", controlID )',
        documentation: 'Shows a control that was hidden.',
        kind: CompletionItemKind.Function
    },
    controltreeview: {
        title: 'ControlTreeView',
        detail: 'ControlTreeView ( "title", "text", controlID, "command" [, option1] )',
        documentation: 'Sends a command to a TreeView32 control.',
        kind: CompletionItemKind.Function
    },
    cos: {
        title: 'Cos',
        detail: 'Cos ( expression )',
        documentation: 'Calculates the cosine of a number.',
        kind: CompletionItemKind.Function
    },
    dec: {
        title: 'Dec',
        detail: 'Dec ( "hex" [, flag = 0] )',
        documentation: 'Returns a numeric representation of a hexadecimal string.',
        kind: CompletionItemKind.Function
    },
    dircopy: {
        title: 'DirCopy',
        detail: 'DirCopy ( "source dir", "dest dir" [, flag = 0] )',
        documentation: 'Copies a directory and all sub-directories and files (Similar to xcopy).',
        kind: CompletionItemKind.Function
    },
    dircreate: {
        title: 'DirCreate',
        detail: 'DirCreate ( "path" )',
        documentation: 'Creates a directory/folder.',
        kind: CompletionItemKind.Function
    },
    dirgetsize: {
        title: 'DirGetSize',
        detail: 'DirGetSize ( "path" [, flag = 0] )',
        documentation: 'Returns the size in bytes of a given directory.',
        kind: CompletionItemKind.Function
    },
    dirmove: {
        title: 'DirMove',
        detail: 'DirMove ( "source dir", "dest dir" [, flag = 0] )',
        documentation: 'Moves a directory and all sub-directories and files.',
        kind: CompletionItemKind.Function
    },
    dirremove: {
        title: 'DirRemove',
        detail: 'DirRemove ( "path" [, recurse = 0] )',
        documentation: 'Deletes a directory/folder.',
        kind: CompletionItemKind.Function
    },
    dllcall: {
        title: 'DllCall',
        detail: 'DllCall ( "dll", "return type", "function" [, type1, param1 [, type n, param n]] )',
        documentation: 'Dynamically calls a function in a DLL.',
        kind: CompletionItemKind.Function
    },
    dllcalladdress: {
        title: 'DllCallAddress',
        detail: 'DllCallAddress ( "return type", address [, type1, param1 [, type n, param n]] )',
        documentation: 'Dynamically calls a function at a specific memory address.',
        kind: CompletionItemKind.Function
    },
    dllcallbackfree: {
        title: 'DllCallbackFree',
        detail: 'DllCallbackFree ( handle )',
        documentation: 'Frees a previously created handle created with DllCallbackRegister.',
        kind: CompletionItemKind.Function
    },
    dllcallbackgetptr: {
        title: 'DllCallbackGetPtr',
        detail: 'DllCallbackGetPtr ( handle )',
        documentation: 'Returns the pointer to a callback function that can be passed to the Win32 API.',
        kind: CompletionItemKind.Function
    },
    dllcallbackregister: {
        title: 'DllCallbackRegister',
        detail: 'DllCallbackRegister ( "function", "return type", "params" )',
        documentation: 'Creates a user-defined DLL Callback function.',
        kind: CompletionItemKind.Function
    },
    dllclose: {
        title: 'DllClose',
        detail: 'DllClose ( dllhandle )',
        documentation: 'Closes a previously opened DLL.',
        kind: CompletionItemKind.Function
    },
    dllopen: {
        title: 'DllOpen',
        detail: 'DllOpen ( "filename" )',
        documentation: 'Opens a DLL file for use in DllCall.',
        kind: CompletionItemKind.Function
    },
    dllstructcreate: {
        title: 'DllStructCreate',
        detail: 'DllStructCreate ( Struct [, Pointer] )',
        documentation: 'Creates a C/C++ style structure to be used in DllCall.',
        kind: CompletionItemKind.Function
    },
    dllstructgetdata: {
        title: 'DllStructGetData',
        detail: 'DllStructGetData ( Struct, Element [, index = Default] )',
        documentation: 'Returns the data of an element of the struct.',
        kind: CompletionItemKind.Function
    },
    dllstructgetptr: {
        title: 'DllStructGetPtr',
        detail: 'DllStructGetPtr ( Struct [, Element] )',
        documentation: 'Returns the pointer to the struct or an element in the struct.',
        kind: CompletionItemKind.Function
    },
    dllstructgetsize: {
        title: 'DllStructGetSize',
        detail: 'DllStructGetSize ( Struct )',
        documentation: 'Returns the size of the struct in bytes.',
        kind: CompletionItemKind.Function
    },
    dllstructsetdata: {
        title: 'DllStructSetData',
        detail: 'DllStructSetData ( Struct, Element, value [, index] )',
        documentation: 'Sets the data of an element in the struct.',
        kind: CompletionItemKind.Function
    },
    drivegetdrive: {
        title: 'DriveGetDrive',
        detail: 'DriveGetDrive ( "type" )',
        documentation: 'Returns an array containing the enumerated drives.',
        kind: CompletionItemKind.Function
    },
    drivegetfilesystem: {
        title: 'DriveGetFileSystem',
        detail: 'DriveGetFileSystem ( "path" )',
        documentation: 'Returns File System Type of a drive.',
        kind: CompletionItemKind.Function
    },
    drivegetlabel: {
        title: 'DriveGetLabel',
        detail: 'DriveGetLabel ( "path" )',
        documentation: 'Returns Volume Label of a drive, if it has one.',
        kind: CompletionItemKind.Function
    },
    drivegetserial: {
        title: 'DriveGetSerial',
        detail: 'DriveGetSerial ( "path" )',
        documentation: 'Returns Serial Number of a drive.',
        kind: CompletionItemKind.Function
    },
    drivegettype: {
        title: 'DriveGetType',
        detail: 'DriveGetType ( "path" [, operation = 1] )',
        documentation: 'Returns drive type.',
        kind: CompletionItemKind.Function
    },
    drivemapadd: {
        title: 'DriveMapAdd',
        detail: 'DriveMapAdd ( "device", "remote share" [, flags = 0 [, "user" [, "password"]]] )',
        documentation: 'Maps a network drive.',
        kind: CompletionItemKind.Function
    },
    drivemapdel: {
        title: 'DriveMapDel',
        detail: 'DriveMapDel ( "drive" )',
        documentation: 'Disconnects a network drive.',
        kind: CompletionItemKind.Function
    },
    drivemapget: {
        title: 'DriveMapGet',
        detail: 'DriveMapGet ( "device" )',
        documentation: 'Retrieves the details of a mapped drive.',
        kind: CompletionItemKind.Function
    },
    drivesetlabel: {
        title: 'DriveSetLabel',
        detail: 'DriveSetLabel ( "path", "label" )',
        documentation: 'Sets the Volume Label of a drive.',
        kind: CompletionItemKind.Function
    },
    drivespacefree: {
        title: 'DriveSpaceFree',
        detail: 'DriveSpaceFree ( "path" )',
        documentation: 'Returns the free disk space of a path in Megabytes.',
        kind: CompletionItemKind.Function
    },
    drivespacetotal: {
        title: 'DriveSpaceTotal',
        detail: 'DriveSpaceTotal ( "path" )',
        documentation: 'Returns the total disk space of a path in Megabytes.',
        kind: CompletionItemKind.Function
    },
    drivestatus: {
        title: 'DriveStatus',
        detail: 'DriveStatus ( "path" )',
        documentation: 'Returns the status of the drive as a string.',
        kind: CompletionItemKind.Function
    },
    envget: {
        title: 'EnvGet',
        detail: 'EnvGet ( "envvariable" )',
        documentation: 'Retrieves an environment variable.',
        kind: CompletionItemKind.Function
    },
    envset: {
        title: 'EnvSet',
        detail: 'EnvSet ( "envvariable" [, "value"] )',
        documentation: 'Writes an environment variable.',
        kind: CompletionItemKind.Function
    },
    envupdate: {
        title: 'EnvUpdate',
        detail: 'EnvUpdate (  )',
        documentation: 'Refreshes the OS environment.',
        kind: CompletionItemKind.Function
    },
    eval: {
        title: 'Eval',
        detail: 'Eval ( string )',
        documentation: 'Return the value of the variable defined by a string.',
        kind: CompletionItemKind.Function
    },
    execute: {
        title: 'Execute',
        detail: 'Execute ( string )',
        documentation: 'Execute an expression.',
        kind: CompletionItemKind.Function
    },
    exp: {
        title: 'Exp',
        detail: 'Exp ( expression )',
        documentation: 'Calculates e to the power of a number.',
        kind: CompletionItemKind.Function
    },
    filechangedir: {
        title: 'FileChangeDir',
        detail: 'FileChangeDir ( "path" )',
        documentation: 'Changes the current working directory.',
        kind: CompletionItemKind.Function
    },
    fileclose: {
        title: 'FileClose',
        detail: 'FileClose ( "filehandle" )',
        documentation: 'Closes a previously opened file.',
        kind: CompletionItemKind.Function
    },
    filecopy: {
        title: 'FileCopy',
        detail: 'FileCopy ( "source", "dest" [, flag = 0] )',
        documentation: 'Copies one or more files.',
        kind: CompletionItemKind.Function
    },
    filecreatentfslink: {
        title: 'FileCreateNTFSLink',
        detail: 'FileCreateNTFSLink ( "source", "hardlink" [, flag = 0] )',
        documentation: 'Creates an NTFS hardlink to a file or a directory.',
        kind: CompletionItemKind.Function
    },
    filecreateshortcut: {
        title: 'FileCreateShortcut',
        detail: 'FileCreateShortcut ( "file", "lnk" [, "workdir" [, "args" [, "desc" [, "icon" [, "hotkey" [, icon number [, state]]]]]]] )',
        documentation: 'Creates a shortcut (.lnk) to a file.',
        kind: CompletionItemKind.Function
    },
    filedelete: {
        title: 'FileDelete',
        detail: 'FileDelete ( "filename" )',
        documentation: 'Delete one or more files.',
        kind: CompletionItemKind.Function
    },
    fileexists: {
        title: 'FileExists',
        detail: 'FileExists ( "path" )',
        documentation: 'Checks if a file or directory exists.',
        kind: CompletionItemKind.Function
    },
    filefindfirstfile: {
        title: 'FileFindFirstFile',
        detail: 'FileFindFirstFile ( "filename" )',
        documentation: 'Creates a search handle, defined by a path and file mask.',
        kind: CompletionItemKind.Function
    },
    filefindnextfile: {
        title: 'FileFindNextFile',
        detail: 'FileFindNextFile ( search [, flag = 0])',
        documentation: 'Returns the next filename defined by the search handle.',
        kind: CompletionItemKind.Function
    },
    fileflush: {
        title: 'FileFlush',
        detail: 'FileFlush ( "filehandle" )',
        documentation: 'Flushes the file\'s buffer to disk.',
        kind: CompletionItemKind.Function
    },
    filegetattrib: {
        title: 'FileGetAttrib',
        detail: 'FileGetAttrib ( "filename" )',
        documentation: 'Returns a code string representing a file\'s attributes.',
        kind: CompletionItemKind.Function
    },
    filegetencoding: {
        title: 'FileGetEncoding',
        detail: 'FileGetEncoding ( "filehandle/filename" [, mode = 1] )',
        documentation: 'Determines the text encoding used in a file.',
        kind: CompletionItemKind.Function
    },
    filegetlongname: {
        title: 'FileGetLongName',
        detail: 'FileGetLongName ( "filename" [, flag = 0] )',
        documentation: 'Returns the long path+name of the path+name passed.',
        kind: CompletionItemKind.Function
    },
    filegetpos: {
        title: 'FileGetPos',
        detail: 'FileGetPos ( "filehandle" )',
        documentation: 'Retrieves the current file position.',
        kind: CompletionItemKind.Function
    },
    filegetshortcut: {
        title: 'FileGetShortcut',
        detail: 'FileGetShortcut ( "lnk" )',
        documentation: 'Retrieves details about a shortcut.',
        kind: CompletionItemKind.Function
    },
    filegetshortname: {
        title: 'FileGetShortName',
        detail: 'FileGetShortName ( "filename" [, flag = 0] )',
        documentation: 'Returns the 8.3 short path+name of the path+name passed.',
        kind: CompletionItemKind.Function
    },
    filegetsize: {
        title: 'FileGetSize',
        detail: 'FileGetSize ( "filename" )',
        documentation: 'Returns the size of a file in bytes.',
        kind: CompletionItemKind.Function
    },
    filegettime: {
        title: 'FileGetTime',
        detail: 'FileGetTime ( "filename" [, option = 0 [, format = 0]] )',
        documentation: 'Returns the time and date information for a file.',
        kind: CompletionItemKind.Function
    },
    filegetversion: {
        title: 'FileGetVersion',
        detail: 'FileGetVersion ( "filename" [, "stringname"] )',
        documentation: 'Returns version information stored in a file.',
        kind: CompletionItemKind.Function
    },
    fileinstall: {
        title: 'FileInstall',
        detail: 'FileInstall ( "source", "dest" [, flag = 0] )',
        documentation: 'Include and install a file with the compiled script.',
        kind: CompletionItemKind.Function
    },
    filemove: {
        title: 'FileMove',
        detail: 'FileMove ( "source", "dest" [, flag = 0] )',
        documentation: 'Moves one or more files.',
        kind: CompletionItemKind.Function
    },
    fileopen: {
        title: 'FileOpen',
        detail: 'FileOpen ( "filename" [, mode = 0] )',
        documentation: 'Opens a file for reading or writing.',
        kind: CompletionItemKind.Function
    },
    fileopendialog: {
        title: 'FileOpenDialog',
        detail: 'FileOpenDialog ( "title", "init dir", "filter" [, options = 0 [, "default name" [, hwnd]]] )',
        documentation: 'Initiates a Open File Dialog.',
        kind: CompletionItemKind.Function
    },
    fileread: {
        title: 'FileRead',
        detail: 'FileRead ( "filehandle/filename" [, count] )',
        documentation: 'Read in a number of characters from a previously opened file.',
        kind: CompletionItemKind.Function
    },
    filereadline: {
        title: 'FileReadLine',
        detail: 'FileReadLine ( "filehandle/filename" [, line = 1] )',
        documentation: 'Read in a line of text from a previously opened text file.',
        kind: CompletionItemKind.Function
    },
    filereadtoarray: {
        title: 'FileReadToArray',
        detail: 'FileReadToArray ( "filehandle/filename" )',
        documentation: 'Reads the specified file into an array.',
        kind: CompletionItemKind.Function
    },
    filerecycle: {
        title: 'FileRecycle',
        detail: 'FileRecycle ( "source" )',
        documentation: 'Sends a file or directory to the recycle bin.',
        kind: CompletionItemKind.Function
    },
    filerecycleempty: {
        title: 'FileRecycleEmpty',
        detail: 'FileRecycleEmpty ( ["source"] )',
        documentation: 'Empties the recycle bin.',
        kind: CompletionItemKind.Function
    },
    filesavedialog: {
        title: 'FileSaveDialog',
        detail: 'FileSaveDialog ( "title", "init dir", "filter" [, options = 0 [, "default name" [, hwnd]]] )',
        documentation: 'Initiates a Save File Dialog.',
        kind: CompletionItemKind.Function
    },
    fileselectfolder: {
        title: 'FileSelectFolder',
        detail: 'FileSelectFolder ( "dialog text", "root dir" [, flag = 0 [, "initial dir" [, hwnd]]] )',
        documentation: 'Initiates a Browse For Folder dialog.',
        kind: CompletionItemKind.Function
    },
    filesetattrib: {
        title: 'FileSetAttrib',
        detail: 'FileSetAttrib ( "file pattern", "+-RASHNOT" [, recurse = 0] )',
        documentation: 'Sets the attributes of one or more files/directories.',
        kind: CompletionItemKind.Function
    },
    filesetend: {
        title: 'FileSetEnd',
        detail: 'FileSetEnd ( "filehandle" )',
        documentation: 'Sets the end of the file at the current file position.',
        kind: CompletionItemKind.Function
    },
    filesetpos: {
        title: 'FileSetPos',
        detail: 'FileSetPos ( "filehandle", offset, origin )',
        documentation: 'Sets the current file position.',
        kind: CompletionItemKind.Function
    },
    filesettime: {
        title: 'FileSetTime',
        detail: 'FileSetTime ( "file pattern", "time" [, type = 0 [, recurse = 0]] )',
        documentation: 'Sets the timestamp of one of more files.',
        kind: CompletionItemKind.Function
    },
    filewrite: {
        title: 'FileWrite',
        detail: 'FileWrite ( "filehandle/filename", "text/data" )',
        documentation: 'Write text/data to the end of a previously opened file.',
        kind: CompletionItemKind.Function
    },
    filewriteline: {
        title: 'FileWriteLine',
        detail: 'FileWriteLine ( "filehandle/filename", "line" )',
        documentation: 'Append a line of text to the end of a previously opened text file.',
        kind: CompletionItemKind.Function
    },
    floor: {
        title: 'Floor',
        detail: 'Floor ( expression )',
        documentation: 'Returns a number rounded down to the closest integer.',
        kind: CompletionItemKind.Function
    },
    ftpsetproxy: {
        title: 'FtpSetProxy',
        detail: 'FtpSetProxy ( mode = 0 [, "proxy:port" [, "username" [, "password"]]] )',
        documentation: 'Sets the internet proxy to use for ftp access.',
        kind: CompletionItemKind.Function
    },
    funcname: {
        title: 'FuncName',
        detail: 'FuncName ( $Functionvariable )',
        documentation: 'Returns the name of a function stored in a variable.',
        kind: CompletionItemKind.Function
    },
    guicreate: {
        title: 'GUICreate',
        detail: 'GUICreate ( "title" [, width [, height [, left = -1 [, top = -1 [, style = -1 [, exStyle = -1 [, parent = 0]]]]]]] )',
        documentation: 'Create a GUI window.',
        kind: CompletionItemKind.Function
    },
    guictrlcreateavi: {
        title: 'GUICtrlCreateAvi',
        detail: 'GUICtrlCreateAvi ( filename, subfileid, left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates an AVI video control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatebutton: {
        title: 'GUICtrlCreateButton',
        detail: 'GUICtrlCreateButton ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a Button control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatecheckbox: {
        title: 'GUICtrlCreateCheckbox',
        detail: 'GUICtrlCreateCheckbox ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a Checkbox control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatecombo: {
        title: 'GUICtrlCreateCombo',
        detail: 'GUICtrlCreateCombo ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a ComboBox control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatecontextmenu: {
        title: 'GUICtrlCreateContextMenu',
        detail: 'GUICtrlCreateContextMenu ( [controlID] )',
        documentation: 'Creates a context menu for a control or entire GUI window.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatedate: {
        title: 'GUICtrlCreateDate',
        detail: 'GUICtrlCreateDate ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a date control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatedummy: {
        title: 'GUICtrlCreateDummy',
        detail: 'GUICtrlCreateDummy (  )',
        documentation: 'Creates a Dummy control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreateedit: {
        title: 'GUICtrlCreateEdit',
        detail: 'GUICtrlCreateEdit ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates an Edit control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreategraphic: {
        title: 'GUICtrlCreateGraphic',
        detail: 'GUICtrlCreateGraphic ( left, top [, width [, height [, style]]] )',
        documentation: 'Creates a Graphic control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreategroup: {
        title: 'GUICtrlCreateGroup',
        detail: 'GUICtrlCreateGroup ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a Group control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreateicon: {
        title: 'GUICtrlCreateIcon',
        detail: 'GUICtrlCreateIcon ( filename, iconName, left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates an Icon control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreateinput: {
        title: 'GUICtrlCreateInput',
        detail: 'GUICtrlCreateInput ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates an Input control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatelabel: {
        title: 'GUICtrlCreateLabel',
        detail: 'GUICtrlCreateLabel ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a static Label control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatelist: {
        title: 'GUICtrlCreateList',
        detail: 'GUICtrlCreateList ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a List control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatelistview: {
        title: 'GUICtrlCreateListView',
        detail: 'GUICtrlCreateListView ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a ListView control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatelistviewitem: {
        title: 'GUICtrlCreateListViewItem',
        detail: 'GUICtrlCreateListViewItem ( "text", listviewID )',
        documentation: 'Creates a ListView item.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatemenu: {
        title: 'GUICtrlCreateMenu',
        detail: 'GUICtrlCreateMenu ( "submenutext" [, menuID = -1 [, menuentry = -1]] )',
        documentation: 'Creates a Menu control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatemenuitem: {
        title: 'GUICtrlCreateMenuItem',
        detail: 'GUICtrlCreateMenuItem ( "text", menuID [, menuentry = -1 [, menuradioitem = 0]] )',
        documentation: 'Creates a MenuItem control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatemonthcal: {
        title: 'GUICtrlCreateMonthCal',
        detail: 'GUICtrlCreateMonthCal ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a month calendar control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreateobj: {
        title: 'GUICtrlCreateObj',
        detail: 'GUICtrlCreateObj ( ObjectVar, left, top [, width [, height]] )',
        documentation: 'Creates an ActiveX control in the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatepic: {
        title: 'GUICtrlCreatePic',
        detail: 'GUICtrlCreatePic ( filename, left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a Picture control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreateprogress: {
        title: 'GUICtrlCreateProgress',
        detail: 'GUICtrlCreateProgress ( left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a Progress control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreateradio: {
        title: 'GUICtrlCreateRadio',
        detail: 'GUICtrlCreateRadio ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a Radio button control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreateslider: {
        title: 'GUICtrlCreateSlider',
        detail: 'GUICtrlCreateSlider ( left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a Slider control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatetab: {
        title: 'GUICtrlCreateTab',
        detail: 'GUICtrlCreateTab ( left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a Tab control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatetabitem: {
        title: 'GUICtrlCreateTabItem',
        detail: 'GUICtrlCreateTabItem ( "text" )',
        documentation: 'Creates a TabItem control within an existing tab control in the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatetreeview: {
        title: 'GUICtrlCreateTreeView',
        detail: 'GUICtrlCreateTreeView ( left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
        documentation: 'Creates a TreeView control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreatetreeviewitem: {
        title: 'GUICtrlCreateTreeViewItem',
        detail: 'GUICtrlCreateTreeViewItem ( "text", treeviewID )',
        documentation: 'Creates a TreeViewItem control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrlcreateupdown: {
        title: 'GUICtrlCreateUpdown',
        detail: 'GUICtrlCreateUpdown ( inputcontrolID [, style = -1] )',
        documentation: 'Creates an UpDown control for the GUI.',
        kind: CompletionItemKind.Function
    },
    guictrldelete: {
        title: 'GUICtrlDelete',
        detail: 'GUICtrlDelete ( controlID )',
        documentation: 'Deletes a control.',
        kind: CompletionItemKind.Function
    },
    guictrlgethandle: {
        title: 'GUICtrlGetHandle',
        detail: 'GUICtrlGetHandle ( controlID )',
        documentation: 'Returns the handle for a control and some special (item) handles (Menu, ContextMenu, TreeViewItem).',
        kind: CompletionItemKind.Function
    },
    guictrlgetstate: {
        title: 'GUICtrlGetState',
        detail: 'GUICtrlGetState ( controlID )',
        documentation: 'Gets the current state of a control.',
        kind: CompletionItemKind.Function
    },
    guictrlread: {
        title: 'GUICtrlRead',
        detail: 'GUICtrlRead ( controlID [, advanced = 0] )',
        documentation: 'Read state or data of a control.',
        kind: CompletionItemKind.Function
    },
    guictrlrecvmsg: {
        title: 'GUICtrlRecvMsg',
        detail: 'GUICtrlRecvMsg ( controlID , msg [, wParam [, lParamType]] )',
        documentation: 'Send a message to a control and retrieve information in lParam.',
        kind: CompletionItemKind.Function
    },
    guictrlregisterlistviewsort: {
        title: 'GUICtrlRegisterListViewSort',
        detail: 'GUICtrlRegisterListViewSort ( controlID, "function" )',
        documentation: 'Register a user defined function for an internal listview sorting callback function.',
        kind: CompletionItemKind.Function
    },
    guictrlsendmsg: {
        title: 'GUICtrlSendMsg',
        detail: 'GUICtrlSendMsg ( controlID, msg , wParam, lParam )',
        documentation: 'Send a message to a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsendtodummy: {
        title: 'GUICtrlSendToDummy',
        detail: 'GUICtrlSendToDummy ( controlID [, state] )',
        documentation: 'Sends a message to a Dummy control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetbkcolor: {
        title: 'GUICtrlSetBkColor',
        detail: 'GUICtrlSetBkColor ( controlID, backgroundcolor )',
        documentation: 'Sets the background color of a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetcolor: {
        title: 'GUICtrlSetColor',
        detail: 'GUICtrlSetColor ( controlID, textcolor )',
        documentation: 'Sets the text color of a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetcursor: {
        title: 'GUICtrlSetCursor',
        detail: 'GUICtrlSetCursor ( controlID, cursorID )',
        documentation: 'Sets the mouse cursor icon for a particular control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetdata: {
        title: 'GUICtrlSetData',
        detail: 'GUICtrlSetData ( controlID, data [, default] )',
        documentation: 'Modifies the data for a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetdefbkcolor: {
        title: 'GUICtrlSetDefBkColor',
        detail: 'GUICtrlSetDefBkColor ( defbkcolor [, winhandle] )',
        documentation: 'Sets the default background color of all the controls of the GUI window.',
        kind: CompletionItemKind.Function
    },
    guictrlsetdefcolor: {
        title: 'GUICtrlSetDefColor',
        detail: 'GUICtrlSetDefColor ( deftextcolor [, winhandle] )',
        documentation: 'Sets the default text color of all the controls of the GUI window.',
        kind: CompletionItemKind.Function
    },
    guictrlsetfont: {
        title: 'GUICtrlSetFont',
        detail: 'GUICtrlSetFont ( controlID, size [, weight [, attribute [, fontname [, quality]]]] )',
        documentation: 'Sets the font for a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetgraphic: {
        title: 'GUICtrlSetGraphic',
        detail: 'GUICtrlSetGraphic ( controlID, type [, par1 [, ... par6]] )',
        documentation: 'Modifies the data for a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetimage: {
        title: 'GUICtrlSetImage',
        detail: 'GUICtrlSetImage ( controlID, filename [, iconname [, icontype]] )',
        documentation: 'Sets the bitmap or icon image to use for a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetlimit: {
        title: 'GUICtrlSetLimit',
        detail: 'GUICtrlSetLimit ( controlID, max [, min = 0] )',
        documentation: 'Limits the number of characters/pixels for a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetonevent: {
        title: 'GUICtrlSetOnEvent',
        detail: 'GUICtrlSetOnEvent ( controlID, "function" )',
        documentation: 'Defines a user-defined function to be called when a control is clicked.',
        kind: CompletionItemKind.Function
    },
    guictrlsetpos: {
        title: 'GUICtrlSetPos',
        detail: 'GUICtrlSetPos ( controlID, left [, top [, width [, height]]] )',
        documentation: 'Changes the position of a control within the GUI window.',
        kind: CompletionItemKind.Function
    },
    guictrlsetresizing: {
        title: 'GUICtrlSetResizing',
        detail: 'GUICtrlSetResizing ( controlID, resizing )',
        documentation: 'Defines the resizing method used by a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetstate: {
        title: 'GUICtrlSetState',
        detail: 'GUICtrlSetState ( controlID, state )',
        documentation: 'Changes the state of a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsetstyle: {
        title: 'GUICtrlSetStyle',
        detail: 'GUICtrlSetStyle ( controlID, style [, exStyle] )',
        documentation: 'Changes the style of a control.',
        kind: CompletionItemKind.Function
    },
    guictrlsettip: {
        title: 'GUICtrlSetTip',
        detail: 'GUICtrlSetTip ( controlID, tiptext [, "title" [, icon [, options]]] )',
        documentation: 'Sets the tip text associated with a control.',
        kind: CompletionItemKind.Function
    },
    guidelete: {
        title: 'GUIDelete',
        detail: 'GUIDelete ( [winhandle] )',
        documentation: 'Deletes a GUI window and all controls that it contains.',
        kind: CompletionItemKind.Function
    },
    guigetcursorinfo: {
        title: 'GUIGetCursorInfo',
        detail: 'GUIGetCursorInfo ( [winhandle] )',
        documentation: 'Gets the mouse cursor position relative to GUI window.',
        kind: CompletionItemKind.Function
    },
    guigetmsg: {
        title: 'GUIGetMsg',
        detail: 'GUIGetMsg ( [advanced = 0] )',
        documentation: 'Polls the GUI to see if any events have occurred.',
        kind: CompletionItemKind.Function
    },
    guigetstyle: {
        title: 'GUIGetStyle',
        detail: 'GUIGetStyle ( [winhandle] )',
        documentation: 'Retrieves the styles of a GUI window.',
        kind: CompletionItemKind.Function
    },
    guiregistermsg: {
        title: 'GUIRegisterMsg',
        detail: 'GUIRegisterMsg ( msgID, "function" )',
        documentation: 'Register a user defined function for a known Windows Message ID (WM_MSG).',
        kind: CompletionItemKind.Function
    },
    guisetaccelerators: {
        title: 'GUISetAccelerators',
        detail: 'GUISetAccelerators ( accelerators [, winhandle] )',
        documentation: 'Sets the accelerator table to be used in a GUI window.',
        kind: CompletionItemKind.Function
    },
    guisetbkcolor: {
        title: 'GUISetBkColor',
        detail: 'GUISetBkColor ( background [, winhandle] )',
        documentation: 'Sets the background color of the GUI window.',
        kind: CompletionItemKind.Function
    },
    guisetcoord: {
        title: 'GUISetCoord',
        detail: 'GUISetCoord ( left, top [, width [, height [, winhandle]]] )',
        documentation: 'Sets absolute coordinates for the next control.',
        kind: CompletionItemKind.Function
    },
    guisetcursor: {
        title: 'GUISetCursor',
        detail: 'GUISetCursor ( [cursorID [, override = 0 [, winhandle]]] )',
        documentation: 'Sets the mouse cursor icon for a GUI window.',
        kind: CompletionItemKind.Function
    },
    guisetfont: {
        title: 'GUISetFont',
        detail: 'GUISetFont ( size [, weight [, attribute [, fontname [, winhandle [, quality]]]]] )',
        documentation: 'Sets the default font for a GUI window.',
        kind: CompletionItemKind.Function
    },
    guisethelp: {
        title: 'GUISetHelp',
        detail: 'GUISetHelp ( helpfile [, winhandle] )',
        documentation: 'Sets an executable file that will be run when F1 is pressed.',
        kind: CompletionItemKind.Function
    },
    guiseticon: {
        title: 'GUISetIcon',
        detail: 'GUISetIcon ( iconfile [, iconID [, winhandle]] )',
        documentation: 'Sets the icon used in a GUI window.',
        kind: CompletionItemKind.Function
    },
    guisetonevent: {
        title: 'GUISetOnEvent',
        detail: 'GUISetOnEvent ( specialID, "function" [, winhandle] )',
        documentation: 'Defines a user function to be called when a system button is clicked.',
        kind: CompletionItemKind.Function
    },
    guisetstate: {
        title: 'GUISetState',
        detail: 'GUISetState ( [flag [, winhandle]] )',
        documentation: 'Changes the state of a GUI window.',
        kind: CompletionItemKind.Function
    },
    guisetstyle: {
        title: 'GUISetStyle',
        detail: 'GUISetStyle ( Style [, ExStyle [, winhandle]] )',
        documentation: 'Changes the styles of a GUI window.',
        kind: CompletionItemKind.Function
    },
    guistartgroup: {
        title: 'GUIStartGroup',
        detail: 'GUIStartGroup ( [winhandle] )',
        documentation: 'Defines that any subsequent controls that are created will be "grouped" together.',
        kind: CompletionItemKind.Function
    },
    guiswitch: {
        title: 'GUISwitch',
        detail: 'GUISwitch ( winhandle [, tabitemID] )',
        documentation: 'Switches the current window used for GUI functions.',
        kind: CompletionItemKind.Function
    },
    hex: {
        title: 'Hex',
        detail: 'Hex ( expression [, length] )',
        documentation: 'Returns a string representation of an integer or of a binary type converted to hexadecimal.',
        kind: CompletionItemKind.Function
    },
    hotkeyset: {
        title: 'HotKeySet',
        detail: 'HotKeySet ( "key" [, "function"] )',
        documentation: 'Sets a hotkey that calls a user function.',
        kind: CompletionItemKind.Function
    },
    httpsetproxy: {
        title: 'HttpSetProxy',
        detail: 'HttpSetProxy ( mode = 0 [, "proxy:port" [, "username" [, "password"]]] )',
        documentation: 'Sets the internet proxy to use for http access.',
        kind: CompletionItemKind.Function
    },
    httpsetuseragent: {
        title: 'HttpSetUserAgent',
        detail: 'HttpSetUserAgent ( "user agent" )',
        documentation: 'Sets the HTTP user-agent string which is sent with all Inet requests.',
        kind: CompletionItemKind.Function
    },
    hwnd: {
        title: 'HWnd',
        detail: 'HWnd ( expression )',
        documentation: 'Converts an expression into an HWND handle.',
        kind: CompletionItemKind.Function
    },
    inetclose: {
        title: 'InetClose',
        detail: 'InetClose ( handle )',
        documentation: 'Closes a handle returned from InetGet().',
        kind: CompletionItemKind.Function
    },
    inetget: {
        title: 'InetGet',
        detail: 'InetGet ( "URL", "filename" [, options = 0 [, background = 0]] )',
        documentation: 'Downloads a file from the internet using the HTTP, HTTPS or FTP protocol.',
        kind: CompletionItemKind.Function
    },
    inetgetinfo: {
        title: 'InetGetInfo',
        detail: 'InetGetInfo ( [handle [, index = -1]] )',
        documentation: 'Returns detailed data for a handle returned from InetGet().',
        kind: CompletionItemKind.Function
    },
    inetgetsize: {
        title: 'InetGetSize',
        detail: 'InetGetSize ( "URL" [, options = 0] )',
        documentation: 'Returns the size (in bytes) of a file located on the internet.',
        kind: CompletionItemKind.Function
    },
    inetread: {
        title: 'InetRead',
        detail: 'InetRead ( "URL" [, options = 0] )',
        documentation: 'Downloads a file from the internet using the HTTP, HTTPS or FTP protocol.',
        kind: CompletionItemKind.Function
    },
    inidelete: {
        title: 'IniDelete',
        detail: 'IniDelete ( "filename", "section" [, "key"] )',
        documentation: 'Deletes a value from a standard format .ini file.',
        kind: CompletionItemKind.Function
    },
    iniread: {
        title: 'IniRead',
        detail: 'IniRead ( "filename", "section", "key", "default" )',
        documentation: 'Reads a value from a standard format .ini file.',
        kind: CompletionItemKind.Function
    },
    inireadsection: {
        title: 'IniReadSection',
        detail: 'IniReadSection ( "filename", "section" )',
        documentation: 'Reads all key/value pairs from a section in a standard format .ini file.',
        kind: CompletionItemKind.Function
    },
    inireadsectionnames: {
        title: 'IniReadSectionNames',
        detail: 'IniReadSectionNames ( "filename" )',
        documentation: 'Reads all sections in a standard format .ini file.',
        kind: CompletionItemKind.Function
    },
    inirenamesection: {
        title: 'IniRenameSection',
        detail: 'IniRenameSection ( "filename", "section", "new section" [, flag = 0] )',
        documentation: 'Renames a section in a standard format .ini file.',
        kind: CompletionItemKind.Function
    },
    iniwrite: {
        title: 'IniWrite',
        detail: 'IniWrite ( "filename", "section", "key", "value" )',
        documentation: 'Writes a value to a standard format .ini file.',
        kind: CompletionItemKind.Function
    },
    iniwritesection: {
        title: 'IniWriteSection',
        detail: 'IniWriteSection ( "filename", "section", "data" [, index = 1] )',
        documentation: 'Writes a section to a standard format .ini file.',
        kind: CompletionItemKind.Function
    },
    inputbox: {
        title: 'InputBox',
        detail: 'InputBox ( "title", "prompt" [, "default" [, "password char" [, width = -1 [, height = -1 [, left = Default [, top = Default [, timeout = 0 [, hwnd]]]]]]]] )',
        documentation: 'Displays an input box to ask the user to enter a string.',
        kind: CompletionItemKind.Function
    },
    int: {
        title: 'Int',
        detail: 'Int ( expression [, flag = 0] )',
        documentation: 'Returns the integer (whole number) representation of an expression.',
        kind: CompletionItemKind.Function
    },
    isadmin: {
        title: 'IsAdmin',
        detail: 'IsAdmin (  )',
        documentation: 'Checks if the current user has full administrator privileges.',
        kind: CompletionItemKind.Function
    },
    isarray: {
        title: 'IsArray',
        detail: 'IsArray ( variable )',
        documentation: 'Checks if a variable is an array type.',
        kind: CompletionItemKind.Function
    },
    isbinary: {
        title: 'IsBinary',
        detail: 'IsBinary ( expression )',
        documentation: 'Checks if a variable or expression is a binary type.',
        kind: CompletionItemKind.Function
    },
    isbool: {
        title: 'IsBool',
        detail: 'IsBool ( variable )',
        documentation: 'Checks if a variable\'s base type is boolean.',
        kind: CompletionItemKind.Function
    },
    isdeclared: {
        title: 'IsDeclared',
        detail: 'IsDeclared ( expression )',
        documentation: 'Check if a variable has been declared.',
        kind: CompletionItemKind.Function
    },
    isdllstruct: {
        title: 'IsDllStruct',
        detail: 'IsDllStruct ( variable )',
        documentation: 'Checks if a variable is a DllStruct type.',
        kind: CompletionItemKind.Function
    },
    isfloat: {
        title: 'IsFloat',
        detail: 'IsFloat ( variable )',
        documentation: 'Checks if the value of a variable or expression has a fractional component.',
        kind: CompletionItemKind.Function
    },
    isfunc: {
        title: 'IsFunc',
        detail: 'IsFunc ( expression )',
        documentation: 'Checks if a variable or expression is a function type.',
        kind: CompletionItemKind.Function
    },
    ishwnd: {
        title: 'IsHWnd',
        detail: 'IsHWnd ( variable )',
        documentation: 'Checks if a variable\'s base type is a pointer and window handle.',
        kind: CompletionItemKind.Function
    },
    isint: {
        title: 'IsInt',
        detail: 'IsInt ( variable )',
        documentation: 'Checks if the value of a variable or expression has no fractional component.',
        kind: CompletionItemKind.Function
    },
    iskeyword: {
        title: 'IsKeyword',
        detail: 'IsKeyword ( variable )',
        documentation: 'Checks if a variable is a keyword (for example, Default).',
        kind: CompletionItemKind.Function
    },
    ismap: {
        title: 'IsMap',
        detail: 'IsMap ( variable )',
        documentation: 'Checks if a variable is a Map type.',
        kind: CompletionItemKind.Function
    },
    isnumber: {
        title: 'IsNumber',
        detail: 'IsNumber ( variable )',
        documentation: 'Checks if a variable\'s base type is numeric.',
        kind: CompletionItemKind.Function
    },
    isobj: {
        title: 'IsObj',
        detail: 'IsObj ( variable )',
        documentation: 'Checks if a variable or expression is an object type.',
        kind: CompletionItemKind.Function
    },
    isptr: {
        title: 'IsPtr',
        detail: 'IsPtr ( variable )',
        documentation: 'Checks if a variable\'s base type is a pointer.',
        kind: CompletionItemKind.Function
    },
    isstring: {
        title: 'IsString',
        detail: 'IsString ( variable )',
        documentation: 'Checks if a variable is a string type.',
        kind: CompletionItemKind.Function
    },
    log: {
        title: 'Log',
        detail: 'Log ( expression )',
        documentation: 'Calculates the natural logarithm of a number.',
        kind: CompletionItemKind.Function
    },
    mapappend: {
        title: 'MapAppend',
        detail: 'MapAppend ( map, value )',
        documentation: 'Add an element to a Map variable.',
        kind: CompletionItemKind.Function
    },
    mapexists: {
        title: 'MapExists',
        detail: 'MapExists ( map, key )',
        documentation: 'Determine whether a key exists within a Map.',
        kind: CompletionItemKind.Function
    },
    mapkeys: {
        title: 'MapKeys',
        detail: 'MapKeys ( map )',
        documentation: 'Returns an array holding the keys within a Map.',
        kind: CompletionItemKind.Function
    },
    mapremove: {
        title: 'MapRemove',
        detail: 'MapRemove ( map, key )',
        documentation: 'Remove a key and its associated value from a Map.',
        kind: CompletionItemKind.Function
    },
    memgetstats: {
        title: 'MemGetStats',
        detail: 'MemGetStats (  )',
        documentation: 'Retrieves memory related information.',
        kind: CompletionItemKind.Function
    },
    mod: {
        title: 'Mod',
        detail: 'Mod ( value1, value2 )',
        documentation: 'Performs the modulus operation.',
        kind: CompletionItemKind.Function
    },
    mouseclick: {
        title: 'MouseClick',
        detail: 'MouseClick ( "button" [, x, y [, clicks = 1 [, speed = 10]]] )',
        documentation: 'Perform a mouse click operation.',
        kind: CompletionItemKind.Function
    },
    mouseclickdrag: {
        title: 'MouseClickDrag',
        detail: 'MouseClickDrag ( "button", x1, y1, x2, y2 [, speed = 10] )',
        documentation: 'Perform a mouse click and drag operation.',
        kind: CompletionItemKind.Function
    },
    mousedown: {
        title: 'MouseDown',
        detail: 'MouseDown ( "button" )',
        documentation: 'Perform a mouse down event at the current mouse position.',
        kind: CompletionItemKind.Function
    },
    mousegetcursor: {
        title: 'MouseGetCursor',
        detail: 'MouseGetCursor (  )',
        documentation: 'Returns the cursor ID Number for the current Mouse Cursor.',
        kind: CompletionItemKind.Function
    },
    mousegetpos: {
        title: 'MouseGetPos',
        detail: 'MouseGetPos ( [dimension] )',
        documentation: 'Retrieves the current position of the mouse cursor.',
        kind: CompletionItemKind.Function
    },
    mousemove: {
        title: 'MouseMove',
        detail: 'MouseMove ( x, y [, speed = 10] )',
        documentation: 'Moves the mouse pointer.',
        kind: CompletionItemKind.Function
    },
    mouseup: {
        title: 'MouseUp',
        detail: 'MouseUp ( "button" )',
        documentation: 'Perform a mouse up event at the current mouse position.',
        kind: CompletionItemKind.Function
    },
    mousewheel: {
        title: 'MouseWheel',
        detail: 'MouseWheel ( "direction" [, clicks = 1] )',
        documentation: 'Moves the mouse wheel up or down.',
        kind: CompletionItemKind.Function
    },
    msgbox: {
        title: 'MsgBox',
        detail: 'MsgBox ( flag, "title", "text" [, timeout = 0 [, hwnd]] )',
        documentation: 'Displays a simple message box with optional timeout.',
        kind: CompletionItemKind.Function
    },
    number: {
        title: 'Number',
        detail: 'Number ( expression [, flag = 0] )',
        documentation: 'Returns the numeric representation of an expression.',
        kind: CompletionItemKind.Function
    },
    objcreate: {
        title: 'ObjCreate',
        detail: 'ObjCreate ( "classname" [, "servername" [, "username" [, "password"]]] )',
        documentation: 'Creates a reference to a COM object from the given classname.',
        kind: CompletionItemKind.Function
    },
    objcreateinterface: {
        title: 'ObjCreateInterface',
        detail: 'ObjCreateInterface ( "CLSID" , "IID" [, "interface_description",[flag = True]] )',
        documentation: 'Creates a reference to an object from the given classname/object pointer, interface identifier and description string.',
        kind: CompletionItemKind.Function
    },
    objevent: {
        title: 'ObjEvent',
        detail: 'ObjEvent ( $ObjectVar, "functionprefix" [, "interface name"] )',
        documentation: 'Handles incoming events from the given Object.',
        kind: CompletionItemKind.Function
    },
    objget: {
        title: 'ObjGet',
        detail: 'ObjGet ( "filename" [, "classname" [, instance]] )',
        documentation: 'Retrieves a reference to a COM object from an existing process or filename.',
        kind: CompletionItemKind.Function
    },
    objname: {
        title: 'ObjName',
        detail: 'ObjName ( $Objectvariable [, Flag = 1] )',
        documentation: 'Returns the name or interface description of an Object.',
        kind: CompletionItemKind.Function
    },
    onautoitexitregister: {
        title: 'OnAutoItExitRegister',
        detail: 'OnAutoItExitRegister ( "function" )',
        documentation: 'Registers a function to be called when AutoIt exits.',
        kind: CompletionItemKind.Function
    },
    onautoitexitunregister: {
        title: 'OnAutoItExitUnRegister',
        detail: 'OnAutoItExitUnRegister ( "function" )',
        documentation: 'UnRegisters a function that was called when AutoIt exits.',
        kind: CompletionItemKind.Function
    },
    ping: {
        title: 'Ping',
        detail: 'Ping ( "address/hostname" [, timeout = 4000] )',
        documentation: 'Pings a host and returns the roundtrip-time.',
        kind: CompletionItemKind.Function
    },
    pixelchecksum: {
        title: 'PixelChecksum',
        detail: 'PixelChecksum ( left, top, right, bottom [, step = 1 [, hwnd [, mode = 0]]] )',
        documentation: 'Generates a checksum for a region of pixels.',
        kind: CompletionItemKind.Function
    },
    pixelgetcolor: {
        title: 'PixelGetColor',
        detail: 'PixelGetColor ( x , y [, hwnd] )',
        documentation: 'Returns a pixel color according to x,y pixel coordinates.',
        kind: CompletionItemKind.Function
    },
    pixelsearch: {
        title: 'PixelSearch',
        detail: 'PixelSearch ( left, top, right, bottom, color [, shade-variation = 0 [, step = 1 [, hwnd]]] )',
        documentation: 'Searches a rectangle of pixels for the pixel color provided.',
        kind: CompletionItemKind.Function
    },
    processclose: {
        title: 'ProcessClose',
        detail: 'ProcessClose ( "process" )',
        documentation: 'Terminates a named process.',
        kind: CompletionItemKind.Function
    },
    processexists: {
        title: 'ProcessExists',
        detail: 'ProcessExists ( "process" )',
        documentation: 'Checks to see if a specified process exists.',
        kind: CompletionItemKind.Function
    },
    processgetstats: {
        title: 'ProcessGetStats',
        detail: 'ProcessGetStats ( ["process" [, type = 0]] )',
        documentation: 'Returns an array about Memory or IO infos of a running process.',
        kind: CompletionItemKind.Function
    },
    processlist: {
        title: 'ProcessList',
        detail: 'ProcessList ( ["name"] )',
        documentation: 'Returns an array listing the currently running processes (names and PIDs).',
        kind: CompletionItemKind.Function
    },
    processsetpriority: {
        title: 'ProcessSetPriority',
        detail: 'ProcessSetPriority ( "process", priority )',
        documentation: 'Changes the priority of a process.',
        kind: CompletionItemKind.Function
    },
    processwait: {
        title: 'ProcessWait',
        detail: 'ProcessWait ( "process" [, timeout = 0] )',
        documentation: 'Pauses script execution until a given process exists.',
        kind: CompletionItemKind.Function
    },
    processwaitclose: {
        title: 'ProcessWaitClose',
        detail: 'ProcessWaitClose ( "process" [, timeout = 0] )',
        documentation: 'Pauses script execution until a given process does not exist.',
        kind: CompletionItemKind.Function
    },
    progressoff: {
        title: 'ProgressOff',
        detail: 'ProgressOff (  )',
        documentation: 'Turns Progress window off.',
        kind: CompletionItemKind.Function
    },
    progresson: {
        title: 'ProgressOn',
        detail: 'ProgressOn ( "title", "maintext" [, "subtext" [, x pos [, y pos [, opt]]]] )',
        documentation: 'Creates a customizable progress bar window.',
        kind: CompletionItemKind.Function
    },
    progressset: {
        title: 'ProgressSet',
        detail: 'ProgressSet ( percent [, "subtext" [, "maintext"]] )',
        documentation: 'Sets the position and/or text of a previously created Progress bar window.',
        kind: CompletionItemKind.Function
    },
    ptr: {
        title: 'Ptr',
        detail: 'Ptr ( expression )',
        documentation: 'Converts an expression into a pointer variant.',
        kind: CompletionItemKind.Function
    },
    random: {
        title: 'Random',
        detail: 'Random ( [Min = 0 [, Max = 1 [, Flag = 0]]] )',
        documentation: 'Generates a pseudo-random float-type number.',
        kind: CompletionItemKind.Function
    },
    regdelete: {
        title: 'RegDelete',
        detail: 'RegDelete ( "keyname" [, "valuename"] )',
        documentation: 'Deletes a key or value from the registry.',
        kind: CompletionItemKind.Function
    },
    regenumkey: {
        title: 'RegEnumKey',
        detail: 'RegEnumKey ( "keyname", instance )',
        documentation: 'Reads the name of a subkey according to its instance.',
        kind: CompletionItemKind.Function
    },
    regenumval: {
        title: 'RegEnumVal',
        detail: 'RegEnumVal ( "keyname", instance )',
        documentation: 'Reads the name of a value according to its instance.',
        kind: CompletionItemKind.Function
    },
    regread: {
        title: 'RegRead',
        detail: 'RegRead ( "keyname", "valuename" )',
        documentation: 'Reads a value from the registry.',
        kind: CompletionItemKind.Function
    },
    regwrite: {
        title: 'RegWrite',
        detail: 'RegWrite ( "keyname" [, "valuename", "type", value] )',
        documentation: 'Creates a key or value in the registry.',
        kind: CompletionItemKind.Function
    },
    round: {
        title: 'Round',
        detail: 'Round ( expression [, decimalplaces] )',
        documentation: 'Returns a number rounded to a specified number of decimal places.',
        kind: CompletionItemKind.Function
    },
    run: {
        title: 'Run',
        detail: 'Run ( "program" [, "workingdir" [, show_flag [, opt_flag]]] )',
        documentation: 'Runs an external program.',
        kind: CompletionItemKind.Function
    },
    runas: {
        title: 'RunAs',
        detail: 'RunAs ( "username", "domain", "password", logon_flag, "program" [, "workingdir" [, show_flag [, opt_flag]]] )',
        documentation: 'Runs an external program under the context of a different user.',
        kind: CompletionItemKind.Function
    },
    runaswait: {
        title: 'RunAsWait',
        detail: 'RunAsWait ( "username", "domain", "password", logon_flag, "program" [, "workingdir" [, show_flag [, opt_flag]]] )',
        documentation: 'Runs an external program under the context of a different user and pauses script execution until the program finishes.',
        kind: CompletionItemKind.Function
    },
    runwait: {
        title: 'RunWait',
        detail: 'RunWait ( "program" [, "workingdir" [, show_flag [, opt_flag]]] )',
        documentation: 'Runs an external program and pauses script execution until the program finishes.',
        kind: CompletionItemKind.Function
    },
    send: {
        title: 'Send',
        detail: 'Send ( "keys" [, flag = 0] )',
        documentation: 'Sends simulated keystrokes to the active window.',
        kind: CompletionItemKind.Function
    },
    sendkeepactive: {
        title: 'SendKeepActive',
        detail: 'SendKeepActive ( "title" [, "text"] )',
        documentation: 'Attempts to keep a specified window active during Send().',
        kind: CompletionItemKind.Function
    },
    seterror: {
        title: 'SetError',
        detail: 'SetError ( code [, extended = 0 [, return value]] )',
        documentation: 'Manually set the value of the @error macro (and optionally @extended, and "Return Value").',
        kind: CompletionItemKind.Function
    },
    setextended: {
        title: 'SetExtended',
        detail: 'SetExtended ( code [, return value] )',
        documentation: 'Manually set the value of the @extended macro.',
        kind: CompletionItemKind.Function
    },
    shellexecute: {
        title: 'ShellExecute',
        detail: 'ShellExecute ( "filename" [, "parameters" [, "workingdir" [, "verb" [, showflag]]]] )',
        documentation: 'Runs an external program using the ShellExecute API.',
        kind: CompletionItemKind.Function
    },
    shellexecutewait: {
        title: 'ShellExecuteWait',
        detail: 'ShellExecuteWait ( "filename" [, "parameters" [, "workingdir" [, "verb" [, showflag]]]] )',
        documentation: 'Runs an external program using the ShellExecute API and pauses script execution until it finishes.',
        kind: CompletionItemKind.Function
    },
    shutdown: {
        title: 'Shutdown',
        detail: 'Shutdown ( code )',
        documentation: 'Shuts down the system.',
        kind: CompletionItemKind.Function
    },
    sin: {
        title: 'Sin',
        detail: 'Sin ( expression )',
        documentation: 'Calculates the sine of a number.',
        kind: CompletionItemKind.Function
    },
    sleep: {
        title: 'Sleep',
        detail: 'Sleep ( delay )',
        documentation: 'Pause script execution.',
        kind: CompletionItemKind.Function
    },
    soundplay: {
        title: 'SoundPlay',
        detail: 'SoundPlay ( "filename" [, wait = 0] )',
        documentation: 'Play a sound file.',
        kind: CompletionItemKind.Function
    },
    soundsetwavevolume: {
        title: 'SoundSetWaveVolume',
        detail: 'SoundSetWaveVolume ( percent )',
        documentation: 'Sets the system wave volume by percent.',
        kind: CompletionItemKind.Function
    },
    splashimageon: {
        title: 'SplashImageOn',
        detail: 'SplashImageOn ( "title", "file" [, width [, height [, x pos [, y pos [, opt]]]]] )',
        documentation: 'Creates a customizable image popup window.',
        kind: CompletionItemKind.Function
    },
    splashoff: {
        title: 'SplashOff',
        detail: 'SplashOff (  )',
        documentation: 'Turns SplashText or SplashImage off.',
        kind: CompletionItemKind.Function
    },
    splashtexton: {
        title: 'SplashTextOn',
        detail: 'SplashTextOn ( "title", "text" [, w = 500 [, h = 400 [, x pos [, y pos [, opt = 0 [, "fontname" [, fontsz = 12 [, fontwt]]]]]]]] )',
        documentation: 'Creates a customizable text popup window.',
        kind: CompletionItemKind.Function
    },
    sqrt: {
        title: 'Sqrt',
        detail: 'Sqrt ( expression )',
        documentation: 'Calculates the square-root of a number.',
        kind: CompletionItemKind.Function
    },
    srandom: {
        title: 'SRandom',
        detail: 'SRandom ( Seed )',
        documentation: 'Set Seed for random number generation.',
        kind: CompletionItemKind.Function
    },
    statusbargettext: {
        title: 'StatusbarGetText',
        detail: 'StatusbarGetText ( "title" [, "text" [, part = 1]] )',
        documentation: 'Retrieves the text from a standard status bar control.',
        kind: CompletionItemKind.Function
    },
    stderrread: {
        title: 'StderrRead',
        detail: 'StderrRead ( process_id [, peek = False [, binary = False]] )',
        documentation: 'Reads from the STDERR stream of a previously run child process.',
        kind: CompletionItemKind.Function
    },
    stdinwrite: {
        title: 'StdinWrite',
        detail: 'StdinWrite ( process_id [, data] )',
        documentation: 'Writes a number of characters to the STDIN stream of a previously run child process.',
        kind: CompletionItemKind.Function
    },
    stdioclose: {
        title: 'StdioClose',
        detail: 'StdioClose ( process_id )',
        documentation: 'Closes all resources associated with a process previously run with STDIO redirection.',
        kind: CompletionItemKind.Function
    },
    stdoutread: {
        title: 'StdoutRead',
        detail: 'StdoutRead ( process_id [, peek = False [, binary = False]] )',
        documentation: 'Reads from the STDOUT stream of a previously run child process.',
        kind: CompletionItemKind.Function
    },
    string: {
        title: 'String',
        detail: 'String ( expression )',
        documentation: 'Returns the string representation of an expression.',
        kind: CompletionItemKind.Function
    },
    stringaddcr: {
        title: 'StringAddCR',
        detail: 'StringAddCR ( "string" )',
        documentation: 'Takes a string and prefixes all linefeed characters ( Chr(10) ) with a carriage return character ( Chr(13) ).',
        kind: CompletionItemKind.Function
    },
    stringcompare: {
        title: 'StringCompare',
        detail: 'StringCompare ( "string1", "string2" [, casesense = 0] )',
        documentation: 'Compares two strings with options.',
        kind: CompletionItemKind.Function
    },
    stringformat: {
        title: 'StringFormat',
        detail: 'StringFormat ( "format control" [, var1 [, ... var32]] )',
        documentation: 'Returns a formatted string (similar to the C sprintf() function).',
        kind: CompletionItemKind.Function
    },
    stringfromasciiarray: {
        title: 'StringFromASCIIArray',
        detail: 'StringFromASCIIArray ( array,[start = 0 [, end = -1 [, encoding = 0]]] )',
        documentation: 'Converts an array of ASCII codes to a string.',
        kind: CompletionItemKind.Function
    },
    stringinstr: {
        title: 'StringInStr',
        detail: 'StringInStr ( "string", "substring" [, casesense = 0 [, occurrence = 1 [, start = 1 [, count]]]] )',
        documentation: 'Checks if a string contains a given substring.',
        kind: CompletionItemKind.Function
    },
    stringisalnum: {
        title: 'StringIsAlNum',
        detail: 'StringIsAlNum ( "string" )',
        documentation: 'Checks if a string contains only alphanumeric characters.',
        kind: CompletionItemKind.Function
    },
    stringisalpha: {
        title: 'StringIsAlpha',
        detail: 'StringIsAlpha ( "string" )',
        documentation: 'Checks if a string contains only alphabetic characters.',
        kind: CompletionItemKind.Function
    },
    stringisascii: {
        title: 'StringIsASCII',
        detail: 'StringIsASCII ( "string" )',
        documentation: 'Checks if a string contains only ASCII characters in the range 0x00 - 0x7f (0 - 127).',
        kind: CompletionItemKind.Function
    },
    stringisdigit: {
        title: 'StringIsDigit',
        detail: 'StringIsDigit ( "string" )',
        documentation: 'Checks if a string contains only digit (0-9) characters.',
        kind: CompletionItemKind.Function
    },
    stringisfloat: {
        title: 'StringIsFloat',
        detail: 'StringIsFloat ( "string" )',
        documentation: 'Checks if a string is a floating point number.',
        kind: CompletionItemKind.Function
    },
    stringisint: {
        title: 'StringIsInt',
        detail: 'StringIsInt ( "string" )',
        documentation: 'Checks if a string is an integer.',
        kind: CompletionItemKind.Function
    },
    stringislower: {
        title: 'StringIsLower',
        detail: 'StringIsLower ( "string" )',
        documentation: 'Checks if a string contains only lowercase characters.',
        kind: CompletionItemKind.Function
    },
    stringisspace: {
        title: 'StringIsSpace',
        detail: 'StringIsSpace ( "string" )',
        documentation: 'Checks if a string contains only whitespace characters.',
        kind: CompletionItemKind.Function
    },
    stringisupper: {
        title: 'StringIsUpper',
        detail: 'StringIsUpper ( "string" )',
        documentation: 'Checks if a string contains only uppercase characters.',
        kind: CompletionItemKind.Function
    },
    stringisxdigit: {
        title: 'StringIsXDigit',
        detail: 'StringIsXDigit ( "string" )',
        documentation: 'Checks if a string contains only hexadecimal digit (0-9, A-F) characters.',
        kind: CompletionItemKind.Function
    },
    stringleft: {
        title: 'StringLeft',
        detail: 'StringLeft ( "string", count )',
        documentation: 'Returns a number of characters from the left-hand side of a string.',
        kind: CompletionItemKind.Function
    },
    stringlen: {
        title: 'StringLen',
        detail: 'StringLen ( "string" )',
        documentation: 'Returns the number of characters in a string.',
        kind: CompletionItemKind.Function
    },
    stringlower: {
        title: 'StringLower',
        detail: 'StringLower ( "string" )',
        documentation: 'Converts a string to lowercase.',
        kind: CompletionItemKind.Function
    },
    stringmid: {
        title: 'StringMid',
        detail: 'StringMid ( "string", start [, count = -1] )',
        documentation: 'Extracts a number of characters from a string.',
        kind: CompletionItemKind.Function
    },
    stringregexp: {
        title: 'StringRegExp',
        detail: 'StringRegExp ( "test", "pattern" [, flag = 0 [, offset = 1]] )',
        documentation: 'Check if a string fits a given regular expression pattern.',
        kind: CompletionItemKind.Function
    },
    stringregexpreplace: {
        title: 'StringRegExpReplace',
        detail: 'StringRegExpReplace ( "test", "pattern", "replace" [, count = 0] )',
        documentation: 'Replace text in a string based on regular expressions.',
        kind: CompletionItemKind.Function
    },
    stringreplace: {
        title: 'StringReplace',
        detail: 'StringReplace ( "string", "searchstring/start", "replacestring" [, occurrence = 0 [, casesense = 0]] )',
        documentation: 'Replaces substrings in a string.',
        kind: CompletionItemKind.Function
    },
    stringreverse: {
        title: 'StringReverse',
        detail: 'StringReverse ( "string" [, flag = 0] )',
        documentation: 'Reverses the contents of the specified string.',
        kind: CompletionItemKind.Function
    },
    stringright: {
        title: 'StringRight',
        detail: 'StringRight ( "string", count )',
        documentation: 'Returns a number of characters from the right-hand side of a string.',
        kind: CompletionItemKind.Function
    },
    stringsplit: {
        title: 'StringSplit',
        detail: 'StringSplit ( "string", "delimiters" [, flag = 0] )',
        documentation: 'Splits up a string into substrings depending on the given delimiters.',
        kind: CompletionItemKind.Function
    },
    stringstripcr: {
        title: 'StringStripCR',
        detail: 'StringStripCR ( "string" )',
        documentation: 'Removes all carriage return values ( Chr(13) ) from a string.',
        kind: CompletionItemKind.Function
    },
    stringstripws: {
        title: 'StringStripWS',
        detail: 'StringStripWS ( "string", flag )',
        documentation: 'Strips the white space in a string.',
        kind: CompletionItemKind.Function
    },
    stringtoasciiarray: {
        title: 'StringToASCIIArray',
        detail: 'StringToASCIIArray ( "string",[start = 0 [, end [, encoding = 0]]] )',
        documentation: 'Converts a string to an array containing the ASCII code of each character.',
        kind: CompletionItemKind.Function
    },
    stringtobinary: {
        title: 'StringToBinary',
        detail: 'StringToBinary ( expression [, flag = 1] )',
        documentation: 'Converts a string into binary data.',
        kind: CompletionItemKind.Function
    },
    stringtrimleft: {
        title: 'StringTrimLeft',
        detail: 'StringTrimLeft ( "string", count )',
        documentation: 'Trims a number of characters from the left hand side of a string.',
        kind: CompletionItemKind.Function
    },
    stringtrimright: {
        title: 'StringTrimRight',
        detail: 'StringTrimRight ( "string", count )',
        documentation: 'Trims a number of characters from the right hand side of a string.',
        kind: CompletionItemKind.Function
    },
    stringupper: {
        title: 'StringUpper',
        detail: 'StringUpper ( "string" )',
        documentation: 'Converts a string to uppercase.',
        kind: CompletionItemKind.Function
    },
    tan: {
        title: 'Tan',
        detail: 'Tan ( expression )',
        documentation: 'Calculates the tangent of a number.',
        kind: CompletionItemKind.Function
    },
    tcpaccept: {
        title: 'TCPAccept',
        detail: 'TCPAccept ( mainsocket )',
        documentation: 'Permits an incoming connection attempt on a socket.',
        kind: CompletionItemKind.Function
    },
    tcpclosesocket: {
        title: 'TCPCloseSocket',
        detail: 'TCPCloseSocket ( socket )',
        documentation: 'Closes a TCP socket.',
        kind: CompletionItemKind.Function
    },
    tcpconnect: {
        title: 'TCPConnect',
        detail: 'TCPConnect ( IPAddr, port )',
        documentation: 'Create a socket connected to an existing server.',
        kind: CompletionItemKind.Function
    },
    tcplisten: {
        title: 'TCPListen',
        detail: 'TCPListen ( IPAddr, port [, MaxPendingConnection] )',
        documentation: 'Creates a socket listening for an incoming connection.',
        kind: CompletionItemKind.Function
    },
    tcpnametoip: {
        title: 'TCPNameToIP',
        detail: 'TCPNameToIP ( name )',
        documentation: 'Converts an Internet name to IP address.',
        kind: CompletionItemKind.Function
    },
    tcprecv: {
        title: 'TCPRecv',
        detail: 'TCPRecv ( mainsocket, maxlen [, flag = 0] )',
        documentation: 'Receives data from a connected socket.',
        kind: CompletionItemKind.Function
    },
    tcpsend: {
        title: 'TCPSend',
        detail: 'TCPSend ( mainsocket, data )',
        documentation: 'Sends data on a connected socket.',
        kind: CompletionItemKind.Function
    },
    tcpshutdown: {
        title: 'TCPShutdown',
        detail: 'TCPShutdown (  )',
        documentation: 'Stops TCP services.',
        kind: CompletionItemKind.Function
    },
    udpshutdown: {
        title: 'UDPShutdown',
        detail: 'UDPShutdown (  )',
        documentation: 'Stops UDP services.',
        kind: CompletionItemKind.Function
    },
    tcpstartup: {
        title: 'TCPStartup',
        detail: 'TCPStartup (  )',
        documentation: 'Starts TCP services.',
        kind: CompletionItemKind.Function
    },
    udpstartup: {
        title: 'UDPStartup',
        detail: 'UDPStartup (  )',
        documentation: 'Starts UDP services.',
        kind: CompletionItemKind.Function
    },
    timerdiff: {
        title: 'TimerDiff',
        detail: 'TimerDiff ( handle )',
        documentation: 'Returns the difference in time from a previous call to TimerInit().',
        kind: CompletionItemKind.Function
    },
    timerinit: {
        title: 'TimerInit',
        detail: 'TimerInit (  )',
        documentation: 'Returns a handle that can be passed to TimerDiff() to calculate the difference in milliseconds.',
        kind: CompletionItemKind.Function
    },
    tooltip: {
        title: 'ToolTip',
        detail: 'ToolTip ( "text" [, x [, y [, "title" [, icon = 0 [, options]]]]] )',
        documentation: 'Creates a tooltip anywhere on the screen.',
        kind: CompletionItemKind.Function
    },
    traycreateitem: {
        title: 'TrayCreateItem',
        detail: 'TrayCreateItem ( "text" [, menuID = -1 [, menuentry = -1 [, menuradioitem = 0]]] )',
        documentation: 'Creates a menuitem control for the tray.',
        kind: CompletionItemKind.Function
    },
    traycreatemenu: {
        title: 'TrayCreateMenu',
        detail: 'TrayCreateMenu ( "sub/menutext" [, menuID = -1 [, menuentry = -1]] )',
        documentation: 'Creates a menu control for the tray menu.',
        kind: CompletionItemKind.Function
    },
    traygetmsg: {
        title: 'TrayGetMsg',
        detail: 'TrayGetMsg (  )',
        documentation: 'Polls the tray to see if any events have occurred.',
        kind: CompletionItemKind.Function
    },
    trayitemdelete: {
        title: 'TrayItemDelete',
        detail: 'TrayItemDelete ( controlID )',
        documentation: 'Deletes a menu/item control from the tray menu.',
        kind: CompletionItemKind.Function
    },
    trayitemgethandle: {
        title: 'TrayItemGetHandle',
        detail: 'TrayItemGetHandle ( controlID )',
        documentation: 'Returns the handle for a tray menu(item).',
        kind: CompletionItemKind.Function
    },
    trayitemgetstate: {
        title: 'TrayItemGetState',
        detail: 'TrayItemGetState ( [controlID] )',
        documentation: 'Gets the current state of a control.',
        kind: CompletionItemKind.Function
    },
    trayitemgettext: {
        title: 'TrayItemGetText',
        detail: 'TrayItemGetText ( controlID )',
        documentation: 'Gets the itemtext of a tray menu/item control.',
        kind: CompletionItemKind.Function
    },
    trayitemsetonevent: {
        title: 'TrayItemSetOnEvent',
        detail: 'TrayItemSetOnEvent ( itemID, "function" )',
        documentation: 'Defines a user-defined function to be called when a tray item is clicked.',
        kind: CompletionItemKind.Function
    },
    trayitemsetstate: {
        title: 'TrayItemSetState',
        detail: 'TrayItemSetState ( controlID, state )',
        documentation: 'Sets the state of a tray menu/item control.',
        kind: CompletionItemKind.Function
    },
    trayitemsettext: {
        title: 'TrayItemSetText',
        detail: 'TrayItemSetText ( controlID, text )',
        documentation: 'Sets the itemtext of a tray menu/item control.',
        kind: CompletionItemKind.Function
    },
    traysetclick: {
        title: 'TraySetClick',
        detail: 'TraySetClick ( flag )',
        documentation: 'Sets the clickmode of the tray icon - what mouseclicks will display the tray menu.',
        kind: CompletionItemKind.Function
    },
    trayseticon: {
        title: 'TraySetIcon',
        detail: 'TraySetIcon ( [filename [, iconID]] )',
        documentation: 'Loads/Sets a specified tray icon.',
        kind: CompletionItemKind.Function
    },
    traysetonevent: {
        title: 'TraySetOnEvent',
        detail: 'TraySetOnEvent ( specialID, "function" )',
        documentation: 'Defines a user function to be called when a special tray action happens.',
        kind: CompletionItemKind.Function
    },
    traysetpauseicon: {
        title: 'TraySetPauseIcon',
        detail: 'TraySetPauseIcon ( [filename [, iconID]] )',
        documentation: 'Loads/Sets a specified tray pause icon.',
        kind: CompletionItemKind.Function
    },
    traysetstate: {
        title: 'TraySetState',
        detail: 'TraySetState ( [flag = 1] )',
        documentation: 'Sets the state of the tray icon.',
        kind: CompletionItemKind.Function
    },
    traysettooltip: {
        title: 'TraySetToolTip',
        detail: 'TraySetToolTip ( [text] )',
        documentation: '(Re)Sets the tooltip text for the tray icon.',
        kind: CompletionItemKind.Function
    },
    traytip: {
        title: 'TrayTip',
        detail: 'TrayTip ( "title", "text", timeout [, option = 0] )',
        documentation: 'Displays a balloon tip from the AutoIt Icon.',
        kind: CompletionItemKind.Function
    },
    ubound: {
        title: 'UBound',
        detail: 'UBound ( Variable [, Dimension = 1] )',
        documentation: 'Returns the size of array dimensions or the number of keys in a map.',
        kind: CompletionItemKind.Function
    },
    udpbind: {
        title: 'UDPBind',
        detail: 'UDPBind ( IPAddr, port )',
        documentation: 'Create a socket bound to an incoming connection.',
        kind: CompletionItemKind.Function
    },
    udpclosesocket: {
        title: 'UDPCloseSocket',
        detail: 'UDPCloseSocket ( socketarray )',
        documentation: 'Close a UDP socket.',
        kind: CompletionItemKind.Function
    },
    udpopen: {
        title: 'UDPOpen',
        detail: 'UDPOpen ( IPAddr, port [, flag = 0] )',
        documentation: 'Open a socket connected to an existing server .',
        kind: CompletionItemKind.Function
    },
    udprecv: {
        title: 'UDPRecv',
        detail: 'UDPRecv ( socketarray, maxlen [, flag = 0] )',
        documentation: 'Receives data from an opened socket.',
        kind: CompletionItemKind.Function
    },
    udpsend: {
        title: 'UDPSend',
        detail: 'UDPSend ( socketarray, data )',
        documentation: 'Sends data on an opened socket.',
        kind: CompletionItemKind.Function
    },
    vargettype: {
        title: 'VarGetType',
        detail: 'VarGetType ( expression )',
        documentation: 'Returns the internal type representation of a variant.',
        kind: CompletionItemKind.Function
    },
    winactivate: {
        title: 'WinActivate',
        detail: 'WinActivate ( "title" [, "text"] )',
        documentation: 'Activates (gives focus to) a window.',
        kind: CompletionItemKind.Function
    },
    winactive: {
        title: 'WinActive',
        detail: 'WinActive ( "title" [, "text"] )',
        documentation: 'Checks to see if a specified window exists and is currently active.',
        kind: CompletionItemKind.Function
    },
    winclose: {
        title: 'WinClose',
        detail: 'WinClose ( "title" [, "text"] )',
        documentation: 'Closes a window.',
        kind: CompletionItemKind.Function
    },
    winexists: {
        title: 'WinExists',
        detail: 'WinExists ( "title" [, "text"] )',
        documentation: 'Checks to see if a specified window exists.',
        kind: CompletionItemKind.Function
    },
    winflash: {
        title: 'WinFlash',
        detail: 'WinFlash ( "title" [, "text" [, flashes = 4 [, delay = 500]]] )',
        documentation: 'Flashes a window in the taskbar.',
        kind: CompletionItemKind.Function
    },
    wingetcaretpos: {
        title: 'WinGetCaretPos',
        detail: 'WinGetCaretPos (  )',
        documentation: 'Returns the coordinates of the caret in the foreground window.',
        kind: CompletionItemKind.Function
    },
    wingetclasslist: {
        title: 'WinGetClassList',
        detail: 'WinGetClassList ( "title" [, "text"] )',
        documentation: 'Retrieves the classes from a window.',
        kind: CompletionItemKind.Function
    },
    wingetclientsize: {
        title: 'WinGetClientSize',
        detail: 'WinGetClientSize ( "title" [, "text"] )',
        documentation: 'Retrieves the size of a given window\'s client area.',
        kind: CompletionItemKind.Function
    },
    wingethandle: {
        title: 'WinGetHandle',
        detail: 'WinGetHandle ( "title" [, "text"] )',
        documentation: 'Retrieves the internal handle of a window.',
        kind: CompletionItemKind.Function
    },
    wingetpos: {
        title: 'WinGetPos',
        detail: 'WinGetPos ( "title" [, "text"] )',
        documentation: 'Retrieves the position and size of a given window.',
        kind: CompletionItemKind.Function
    },
    wingetprocess: {
        title: 'WinGetProcess',
        detail: 'WinGetProcess ( "title" [, "text"] )',
        documentation: 'Retrieves the Process ID (PID) associated with a window.',
        kind: CompletionItemKind.Function
    },
    wingetstate: {
        title: 'WinGetState',
        detail: 'WinGetState ( "title" [, "text"] )',
        documentation: 'Retrieves the state of a given window.',
        kind: CompletionItemKind.Function
    },
    wingettext: {
        title: 'WinGetText',
        detail: 'WinGetText ( "title" [, "text"] )',
        documentation: 'Retrieves the text from a window.',
        kind: CompletionItemKind.Function
    },
    wingettitle: {
        title: 'WinGetTitle',
        detail: 'WinGetTitle ( "title" [, "text"] )',
        documentation: 'Retrieves the full title from a window.',
        kind: CompletionItemKind.Function
    },
    winkill: {
        title: 'WinKill',
        detail: 'WinKill ( "title" [, "text"] )',
        documentation: 'Forces a window to close.',
        kind: CompletionItemKind.Function
    },
    winlist: {
        title: 'WinList',
        detail: 'WinList ( ["title" [, "text"]] )',
        documentation: 'Retrieves a list of windows.',
        kind: CompletionItemKind.Function
    },
    winmenuselectitem: {
        title: 'WinMenuSelectItem',
        detail: 'WinMenuSelectItem ( "title", "text", "item" [, "item" [, "item" [, "item" [, "item" [, "item" [, "item"]]]]]] )',
        documentation: 'Invokes a menu item of a window.',
        kind: CompletionItemKind.Function
    },
    winminimizeall: {
        title: 'WinMinimizeAll',
        detail: 'WinMinimizeAll (  )',
        documentation: 'Minimizes all windows.',
        kind: CompletionItemKind.Function
    },
    winminimizeallundo: {
        title: 'WinMinimizeAllUndo',
        detail: 'WinMinimizeAllUndo (  )',
        documentation: 'Undoes a previous WinMinimizeAll function.',
        kind: CompletionItemKind.Function
    },
    winmove: {
        title: 'WinMove',
        detail: 'WinMove ( "title", "text", x, y [, width [, height [, speed]]] )',
        documentation: 'Moves and/or resizes a window.',
        kind: CompletionItemKind.Function
    },
    winsetontop: {
        title: 'WinSetOnTop',
        detail: 'WinSetOnTop ( "title", "text", flag )',
        documentation: 'Change a window\'s "Always On Top" attribute.',
        kind: CompletionItemKind.Function
    },
    winsetstate: {
        title: 'WinSetState',
        detail: 'WinSetState ( "title", "text", flag )',
        documentation: 'Shows, hides, minimizes, maximizes, or restores a window.',
        kind: CompletionItemKind.Function
    },
    winsettitle: {
        title: 'WinSetTitle',
        detail: 'WinSetTitle ( "title", "text", "newtitle" )',
        documentation: 'Changes the title of a window.',
        kind: CompletionItemKind.Function
    },
    winsettrans: {
        title: 'WinSetTrans',
        detail: 'WinSetTrans ( "title", "text", transparency )',
        documentation: 'Sets the transparency of a window.',
        kind: CompletionItemKind.Function
    },
    winwait: {
        title: 'WinWait',
        detail: 'WinWait ( "title" [, "text" [, timeout = 0]] )',
        documentation: 'Pauses execution of the script until the requested window exists.',
        kind: CompletionItemKind.Function
    },
    winwaitactive: {
        title: 'WinWaitActive',
        detail: 'WinWaitActive ( "title" [, "text" [, timeout = 0]] )',
        documentation: 'Pauses execution of the script until the requested window is active.',
        kind: CompletionItemKind.Function
    },
    winwaitclose: {
        title: 'WinWaitClose',
        detail: 'WinWaitClose ( "title" [, "text" [, timeout = 0]] )',
        documentation: 'Pauses execution of the script until the requested window does not exist.',
        kind: CompletionItemKind.Function
    },
    winwaitnotactive: {
        title: 'WinWaitNotActive',
        detail: 'WinWaitNotActive ( "title" [, "text" [, timeout = 0]] )',
        documentation: 'Pauses execution of the script until the requested window is not active.',
        kind: CompletionItemKind.Function
    },
} as documentationCollection;
