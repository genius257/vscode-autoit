import { CompletionItemKind } from 'vscode-languageserver';

/**
 * @file file for providing intellisense information for internal AutoIt3 functions, macros and such.
 */

/** A documentation object used for intellisense. */
export type documentation = {
    title: string,
    detail?: string,
    documentation?: string,
    kind: CompletionItemKind,
};

/** A collection of documentaion object used for intellisense. */
export type documentationCollection = Record<string, documentation>;

export default {
    And: {
        title: 'And',
        kind: CompletionItemKind.Keyword,
    },
    ByRef: {
        title: 'ByRef',
        kind: CompletionItemKind.Keyword,
    },
    Case: {
        title: 'Case',
        kind: CompletionItemKind.Keyword,
    },
    Const: {
        title: 'Const',
        kind: CompletionItemKind.Keyword,
    },
    ContinueCase: {
        title: 'ContinueCase',
        kind: CompletionItemKind.Keyword,
    },
    ContinueLoop: {
        title: 'ContinueLoop',
        kind: CompletionItemKind.Keyword,
    },
    Default: {
        title: 'Default',
        kind: CompletionItemKind.Keyword,
    },
    Dim: {
        title: 'Dim',
        kind: CompletionItemKind.Keyword,
    },
    Do: {
        title: 'Do',
        kind: CompletionItemKind.Keyword,
    },
    Else: {
        title: 'Else',
        kind: CompletionItemKind.Keyword,
    },
    ElseIf: {
        title: 'ElseIf',
        kind: CompletionItemKind.Keyword,
    },
    EndFunc: {
        title: 'EndFunc',
        kind: CompletionItemKind.Keyword,
    },
    EndIf: {
        title: 'EndIf',
        kind: CompletionItemKind.Keyword,
    },
    EndSelect: {
        title: 'EndSelect',
        kind: CompletionItemKind.Keyword,
    },
    EndSwitch: {
        title: 'EndSwitch',
        kind: CompletionItemKind.Keyword,
    },
    EndWith: {
        title: 'EndWith',
        kind: CompletionItemKind.Keyword,
    },
    Enum: {
        title: 'Enum',
        kind: CompletionItemKind.Keyword,
    },
    Exit: {
        title: 'Exit',
        detail: 'Exit ( $return_code = 0 )',
        documentation: [
            '```au3',
            'Exit ( $return_code = 0 )',
            '```',
            'Terminates the script.',
        ].join('\n'),
        kind: CompletionItemKind.Function,
    },
    ExitLoop: {
        title: 'ExitLoop',
        kind: CompletionItemKind.Keyword,
    },
    False: {
        title: 'False',
        kind: CompletionItemKind.Keyword,
    },
    For: {
        title: 'For',
        kind: CompletionItemKind.Keyword,
    },
    Func: {
        title: 'Func',
        kind: CompletionItemKind.Keyword,
    },
    Global: {
        title: 'Global',
        kind: CompletionItemKind.Keyword,
    },
    If: {
        title: 'If',
        kind: CompletionItemKind.Keyword,
    },
    In: {
        title: 'In',
        kind: CompletionItemKind.Keyword,
    },
    Local: {
        title: 'Local',
        kind: CompletionItemKind.Keyword,
    },
    Next: {
        title: 'Next',
        kind: CompletionItemKind.Keyword,
    },
    Not: {
        title: 'Not',
        kind: CompletionItemKind.Keyword,
    },
    Null: {
        title: 'Null',
        kind: CompletionItemKind.Keyword,
    },
    Or: {
        title: 'Or',
        kind: CompletionItemKind.Keyword,
    },
    Redim: {
        title: 'Redim',
        kind: CompletionItemKind.Keyword,
    },
    Return: {
        title: 'Return',
        kind: CompletionItemKind.Keyword,
    },
    Select: {
        title: 'Select',
        kind: CompletionItemKind.Keyword,
    },
    Static: {
        title: 'Static',
        kind: CompletionItemKind.Keyword,
    },
    Step: {
        title: 'Step',
        kind: CompletionItemKind.Keyword,
    },
    Switch: {
        title: 'Switch',
        kind: CompletionItemKind.Keyword,
    },
    Then: {
        title: 'Then',
        kind: CompletionItemKind.Keyword,
    },
    To: {
        title: 'To',
        kind: CompletionItemKind.Keyword,
    },
    True: {
        title: 'True',
        kind: CompletionItemKind.Keyword,
    },
    Until: {
        title: 'Until',
        kind: CompletionItemKind.Keyword,
    },
    Volatile: {
        title: 'Volatile',
        kind: CompletionItemKind.Keyword,
    },
    WEnd: {
        title: 'WEnd',
        kind: CompletionItemKind.Keyword,
    },
    While: {
        title: 'While',
        kind: CompletionItemKind.Keyword,
    },
    With: {
        title: 'With',
        kind: CompletionItemKind.Keyword,
    },
    '@appdatacommondir': {
        title: '@AppDataCommonDir',
        documentation: 'Path to Application Data',
        kind: CompletionItemKind.Constant,
    },
    '@appdatadir': {
        title: '@AppDataDir',
        documentation: 'Path to current user\'s Roaming Application Data',
        kind: CompletionItemKind.Constant,
    },
    '@autoitexe': {
        title: '@AutoItExe',
        documentation: 'The full path and filename of the AutoIt executable currently running. For compiled scripts it is the path of the compiled script; for .a3x and .au3 files it is the path of the interpreter running the file.',
        kind: CompletionItemKind.Constant,
    },
    '@autoitpid': {
        title: '@AutoItPID',
        documentation: 'Process identifier (PID) of the current script.',
        kind: CompletionItemKind.Constant,
    },
    '@autoitversion': {
        title: '@AutoItVersion',
        documentation: 'Version number of AutoIt such as 3.3.10.2',
        kind: CompletionItemKind.Constant,
    },
    '@autoitx64': {
        title: '@AutoItX64',
        documentation: 'Returns 1 if the script is running under the native x64 version of AutoIt.',
        kind: CompletionItemKind.Constant,
    },
    '@com_eventobj': {
        title: '@COM_EventObj',
        documentation: 'Object the COM event is being fired on. Only valid in a COM event function.',
        kind: CompletionItemKind.Constant,
    },
    '@commonfilesdir': {
        title: '@CommonFilesDir',
        documentation: 'Path to Common Files folder',
        kind: CompletionItemKind.Constant,
    },
    '@compiled': {
        title: '@Compiled',
        documentation: 'Returns 1 if script is a compiled executable or an .a3x file; returns 0 if an .au3 file.',
        kind: CompletionItemKind.Constant,
    },
    '@computername': {
        title: '@ComputerName',
        documentation: 'Computer\'s network name.',
        kind: CompletionItemKind.Constant,
    },
    '@comspec': {
        title: '@ComSpec',
        documentation: 'Value of %COMSPEC%, the SPECified secondary COMmand interpreter;',
        kind: CompletionItemKind.Constant,
    },
    '@cpuarch': {
        title: '@CPUArch',
        documentation: 'Returns "X86" when the CPU is a 32-bit CPU and "X64" when the CPU is 64-bit.',
        kind: CompletionItemKind.Constant,
    },
    '@cr': {
        title: '@CR',
        documentation: 'Carriage return,',
        kind: CompletionItemKind.Constant,
    },
    '@crlf': {
        title: '@CRLF',
        documentation: '@CR &amp; @LF; typically used for line breaks.',
        kind: CompletionItemKind.Constant,
    },
    '@desktopcommondir': {
        title: '@DesktopCommonDir',
        documentation: 'Path to Desktop',
        kind: CompletionItemKind.Constant,
    },
    '@desktopdepth': {
        title: '@DesktopDepth',
        documentation: 'Depth of the primary display in bits per pixel.',
        kind: CompletionItemKind.Constant,
    },
    '@desktopdir': {
        title: '@DesktopDir',
        documentation: 'Path to current user\'s Desktop',
        kind: CompletionItemKind.Constant,
    },
    '@desktopheight': {
        title: '@DesktopHeight',
        documentation: 'Height of the primary display in pixels. (Vertical resolution)',
        kind: CompletionItemKind.Constant,
    },
    '@desktoprefresh': {
        title: '@DesktopRefresh',
        documentation: 'Refresh rate of the primary display in hertz.',
        kind: CompletionItemKind.Constant,
    },
    '@desktopwidth': {
        title: '@DesktopWidth',
        documentation: 'Width of the primary display in pixels. (Horizontal resolution)',
        kind: CompletionItemKind.Constant,
    },
    '@documentscommondir': {
        title: '@DocumentsCommonDir',
        documentation: 'Path to Documents',
        kind: CompletionItemKind.Constant,
    },
    '@error': {
        title: '@error',
        documentation: 'Status of the error flag. See the function SetError().',
        kind: CompletionItemKind.Constant,
    },
    '@exitcode': {
        title: '@exitCode',
        documentation: 'Exit code as set by Exit statement.',
        kind: CompletionItemKind.Constant,
    },
    '@exitmethod': {
        title: '@exitMethod',
        documentation: 'Exit method. See the function OnAutoItExitRegister().',
        kind: CompletionItemKind.Constant,
    },
    '@extended': {
        title: '@extended',
        documentation: 'Extended function return - used in certain functions such as StringReplace().',
        kind: CompletionItemKind.Constant,
    },
    '@favoritescommondir': {
        title: '@FavoritesCommonDir',
        documentation: 'Path to Favorites',
        kind: CompletionItemKind.Constant,
    },
    '@favoritesdir': {
        title: '@FavoritesDir',
        documentation: 'Path to current user\'s Favorites',
        kind: CompletionItemKind.Constant,
    },
    '@gui_ctrlhandle': {
        title: '@GUI_CtrlHandle',
        documentation: 'Last click GUI Control handle. Only valid in an event Function. See the GUICtrlSetOnEvent() function.',
        kind: CompletionItemKind.Constant,
    },
    '@gui_ctrlid': {
        title: '@GUI_CtrlId',
        documentation: 'Last click GUI Control identifier. Only valid in an event Function. See the GUICtrlSetOnEvent() function.',
        kind: CompletionItemKind.Constant,
    },
    '@gui_dragfile': {
        title: '@GUI_DragFile',
        documentation: 'Filename of the file being dropped. Only valid on Drop Event. See the GUISetOnEvent() function.',
        kind: CompletionItemKind.Constant,
    },
    '@gui_dragid': {
        title: '@GUI_DragId',
        documentation: 'Drag GUI Control identifier. Only valid on Drop Event. See the GUISetOnEvent() function.',
        kind: CompletionItemKind.Constant,
    },
    '@gui_dropid': {
        title: '@GUI_DropId',
        documentation: 'Drop GUI Control identifier. Only valid on Drop Event. See the GUISetOnEvent() function.',
        kind: CompletionItemKind.Constant,
    },
    '@gui_winhandle': {
        title: '@GUI_WinHandle',
        documentation: 'Last click GUI window handle. Only valid in an event Function. See the GUICtrlSetOnEvent() function.',
        kind: CompletionItemKind.Constant,
    },
    '@homedrive': {
        title: '@HomeDrive',
        documentation: 'Drive letter of drive containing current user\'s home directory.',
        kind: CompletionItemKind.Constant,
    },
    '@homepath': {
        title: '@HomePath',
        documentation: 'Directory part of current user\'s home directory. To get the full path, use in conjunction with @HomeDrive.',
        kind: CompletionItemKind.Constant,
    },
    '@homeshare': {
        title: '@HomeShare',
        documentation: 'Server and share name containing current user\'s home directory.',
        kind: CompletionItemKind.Constant,
    },
    '@hotkeypressed': {
        title: '@HotKeyPressed',
        documentation: 'Last hotkey pressed. See the HotKeySet() function.',
        kind: CompletionItemKind.Constant,
    },
    '@hour': {
        title: '@HOUR',
        documentation: 'Hours value of clock in 24-hour format. Range is 00 to 23',
        kind: CompletionItemKind.Constant,
    },
    '@ipaddress1': {
        title: '@IPAddress1',
        documentation: 'IP address of first network adapter. Tends to return 127.0.0.1 on some computers.',
        kind: CompletionItemKind.Constant,
    },
    '@ipaddress2': {
        title: '@IPAddress2',
        documentation: 'IP address of second network adapter. Returns 0.0.0.0 if not applicable.',
        kind: CompletionItemKind.Constant,
    },
    '@ipaddress3': {
        title: '@IPAddress3',
        documentation: 'IP address of third network adapter. Returns 0.0.0.0 if not applicable.',
        kind: CompletionItemKind.Constant,
    },
    '@ipaddress4': {
        title: '@IPAddress4',
        documentation: 'IP address of fourth network adapter. Returns 0.0.0.0 if not applicable.',
        kind: CompletionItemKind.Constant,
    },
    '@kblayout': {
        title: '@KBLayout',
        documentation: 'Returns code denoting Keyboard Layout. See [Appendix](https://www.autoitscript.com/autoit3/docs/appendix/OSLangCodes.htm) for possible values.',
        kind: CompletionItemKind.Constant,
    },
    '@lf': {
        title: '@LF',
        documentation: 'Line feed, Chr(10); occasionally used for line breaks.',
        kind: CompletionItemKind.Constant,
    },
    '@localappdatadir': {
        title: '@LocalAppDataDir',
        documentation: 'Path to current user\'s Local Application Data',
        kind: CompletionItemKind.Constant,
    },
    '@logondnsdomain': {
        title: '@LogonDNSDomain',
        documentation: 'Logon DNS Domain.',
        kind: CompletionItemKind.Constant,
    },
    '@logondomain': {
        title: '@LogonDomain',
        documentation: 'Logon Domain.',
        kind: CompletionItemKind.Constant,
    },
    '@logonserver': {
        title: '@LogonServer',
        documentation: 'Logon server.',
        kind: CompletionItemKind.Constant,
    },
    '@mday': {
        title: '@MDAY',
        documentation: 'Current day of month. Range is 01 to 31',
        kind: CompletionItemKind.Constant,
    },
    '@min': {
        title: '@MIN',
        documentation: 'Minutes value of clock. Range is 00 to 59',
        kind: CompletionItemKind.Constant,
    },
    '@mon': {
        title: '@MON',
        documentation: 'Current month. Range is 01 to 12',
        kind: CompletionItemKind.Constant,
    },
    '@msec': {
        title: '@MSEC',
        documentation: 'Milliseconds value of clock. Range is 000 to 999. The update frequency of this value depends on the timer resolution of the hardware and may not update every millisecond.',
        kind: CompletionItemKind.Constant,
    },
    '@muilang': {
        title: '@MUILang',
        documentation: 'Returns code denoting Multi Language if available (Vista is OK by default). See [Appendix](https://www.autoitscript.com/autoit3/docs/appendix/OSLangCodes.htm) for possible values.',
        kind: CompletionItemKind.Constant,
    },
    '@mydocumentsdir': {
        title: '@MyDocumentsDir',
        documentation: 'Path to My Documents target',
        kind: CompletionItemKind.Constant,
    },
    '@numparams': {
        title: '@NumParams',
        documentation: 'Number of parameters used in calling the user function.',
        kind: CompletionItemKind.Constant,
    },
    '@osarch': {
        title: '@OSArch',
        documentation: 'Returns one of the following: "X86", "IA64", "X64" - this is the architecture type of the currently running operating system.',
        kind: CompletionItemKind.Constant,
    },
    '@osbuild': {
        title: '@OSBuild',
        documentation: 'Returns the OS build number. For example, Windows 2003 Server returns 3790',
        kind: CompletionItemKind.Constant,
    },
    '@oslang': {
        title: '@OSLang',
        documentation: 'Returns code denoting OS Language. See [Appendix](https://www.autoitscript.com/autoit3/docs/appendix/OSLangCodes.htm) for possible values.',
        kind: CompletionItemKind.Constant,
    },
    '@osservicepack': {
        title: '@OSServicePack',
        documentation: 'Service pack info in the form of "Service Pack 3".',
        kind: CompletionItemKind.Constant,
    },
    '@ostype': {
        title: '@OSType',
        documentation: 'Returns "WIN32_NT" for XP/2003/Vista/2008/Win7/2008R2/Win8/2012/Win8.1/2012R2.',
        kind: CompletionItemKind.Constant,
    },
    '@osversion': {
        title: '@OSVersion',
        documentation: 'Returns one of the following: "WIN_11", "WIN_10", "WIN_81", "WIN_8", "WIN_7", "WIN_VISTA", "WIN_XP", "WIN_XPe",\nfor Windows servers: "WIN_2019", "WIN_2022", "WIN_2016", "WIN_2012R2", "WIN_2012", "WIN_2008R2", "WIN_2008", "WIN_2003".',
        kind: CompletionItemKind.Constant,
    },
    '@programfilesdir': {
        title: '@ProgramFilesDir',
        documentation: 'Path to Program Files folder',
        kind: CompletionItemKind.Constant,
    },
    '@programscommondir': {
        title: '@ProgramsCommonDir',
        documentation: 'Path to Start Menu\'s Programs folder',
        kind: CompletionItemKind.Constant,
    },
    '@programsdir': {
        title: '@ProgramsDir',
        documentation: 'Path to current user\'s Programs (folder on Start Menu)',
        kind: CompletionItemKind.Constant,
    },
    '@scriptdir': {
        title: '@ScriptDir',
        documentation: 'Directory containing the running script. Only includes a trailing backslash when the script is located in the root of a drive.',
        kind: CompletionItemKind.Constant,
    },
    '@scriptfullpath': {
        title: '@ScriptFullPath',
        documentation: 'Equivalent to:\n```au3\n@ScriptDir & "\\" & @ScriptName\n```',
        kind: CompletionItemKind.Constant,
    },
    '@scriptlinenumber': {
        title: '@ScriptLineNumber',
        documentation: 'Line number being executed - useful for debug statements (e.g. location of function call). Only significant in uncompiled scripts - note that #include files return their internal line numbering',
        kind: CompletionItemKind.Constant,
    },
    '@scriptname': {
        title: '@ScriptName',
        documentation: 'Filename of the running script.',
        kind: CompletionItemKind.Constant,
    },
    '@sec': {
        title: '@SEC',
        documentation: 'Seconds value of clock. Range is 00 to 59',
        kind: CompletionItemKind.Constant,
    },
    '@startmenucommondir': {
        title: '@StartMenuCommonDir',
        documentation: 'Path to Start Menu folder',
        kind: CompletionItemKind.Constant,
    },
    '@startmenudir': {
        title: '@StartMenuDir',
        documentation: 'Path to current user\'s Start Menu',
        kind: CompletionItemKind.Constant,
    },
    '@startupcommondir': {
        title: '@StartupCommonDir',
        documentation: 'Path to Startup folder',
        kind: CompletionItemKind.Constant,
    },
    '@startupdir': {
        title: '@StartupDir',
        documentation: 'current user\'s Startup folder',
        kind: CompletionItemKind.Constant,
    },
    '@sw_disable': {
        title: '@SW_DISABLE',
        documentation: 'Disables the window.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_enable': {
        title: '@SW_ENABLE',
        documentation: 'Enables the window.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_hide': {
        title: '@SW_HIDE',
        documentation: 'Hides the window and activates another window.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_lock': {
        title: '@SW_LOCK',
        documentation: 'Lock the window to avoid repainting.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_maximize': {
        title: '@SW_MAXIMIZE',
        documentation: 'Activates the window and displays it as a maximized window.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_minimize': {
        title: '@SW_MINIMIZE',
        documentation: 'Minimizes the specified window and activates the next top-level window in the Z order.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_restore': {
        title: '@SW_RESTORE',
        documentation: 'Activates and displays the window. If the window is minimized or maximized, the system restores it to its original size and position. An application should specify this flag when restoring a minimized window.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_show': {
        title: '@SW_SHOW',
        documentation: 'Activates the window and displays it in its current size and position.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_showdefault': {
        title: '@SW_SHOWDEFAULT',
        documentation: 'Sets the show state based on the SW_ value specified by the program that started the application.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_showmaximized': {
        title: '@SW_SHOWMAXIMIZED',
        documentation: 'Activates the window and displays it as a maximized window.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_showminimized': {
        title: '@SW_SHOWMINIMIZED',
        documentation: 'Activates the window and displays it as a minimized window.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_showminnoactive': {
        title: '@SW_SHOWMINNOACTIVE',
        documentation: 'Displays the window as a minimized window. This value is similar to @SW_SHOWMINIMIZED, except the window is not activated.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_showna': {
        title: '@SW_SHOWNA',
        documentation: 'Displays the window in its current size and position. This value is similar to @SW_SHOW, except the window is not activated.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_shownoactivate': {
        title: '@SW_SHOWNOACTIVATE',
        documentation: 'Displays a window in its most recent size and position. This value is similar to @SW_SHOWNORMAL, except the window is not activated.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_shownormal': {
        title: '@SW_SHOWNORMAL',
        documentation: 'Activates and displays a window. If the window is minimized or maximized, the system restores it to its original size and position. An application should specify this flag when displaying the window for the first time.',
        kind: CompletionItemKind.Constant,
    },
    '@sw_unlock': {
        title: '@SW_UNLOCK',
        documentation: 'Unlock window to allow painting.',
        kind: CompletionItemKind.Constant,
    },
    '@systemdir': {
        title: '@SystemDir',
        documentation: 'Path to the Windows\' System (or System32) folder.',
        kind: CompletionItemKind.Constant,
    },
    '@tab': {
        title: '@TAB',
        documentation: 'Tab character, Chr(9)',
        kind: CompletionItemKind.Constant,
    },
    '@tempdir': {
        title: '@TempDir',
        documentation: 'Path to the temporary files folder.',
        kind: CompletionItemKind.Constant,
    },
    '@tray_id': {
        title: '@TRAY_ID',
        documentation: 'Last clicked item identifier during a TraySetOnEvent() or TrayItemSetOnEvent() action.',
        kind: CompletionItemKind.Constant,
    },
    '@trayiconflashing': {
        title: '@TrayIconFlashing',
        documentation: 'Returns 1 if tray icon is flashing; otherwise, returns 0.',
        kind: CompletionItemKind.Constant,
    },
    '@trayiconvisible': {
        title: '@TrayIconVisible',
        documentation: 'Returns 1 if tray icon is visible; otherwise, returns 0.',
        kind: CompletionItemKind.Constant,
    },
    '@username': {
        title: '@UserName',
        documentation: 'ID of the currently logged on user.',
        kind: CompletionItemKind.Constant,
    },
    '@userprofiledir': {
        title: '@UserProfileDir',
        documentation: 'Path to current user\'s Profile folder.',
        kind: CompletionItemKind.Constant,
    },
    '@wday': {
        title: '@WDAY',
        documentation: 'Numeric day of week. Range is 1 to 7 which corresponds to Sunday through Saturday.',
        kind: CompletionItemKind.Constant,
    },
    '@windowsdir': {
        title: '@WindowsDir',
        documentation: 'Path to Windows folder',
        kind: CompletionItemKind.Constant,
    },
    '@workingdir': {
        title: '@WorkingDir',
        documentation: 'Current/active working directory. Only includes a trailing backslash when the script is located in the root of a drive.',
        kind: CompletionItemKind.Constant,
    },
    '@yday': {
        title: '@YDAY',
        documentation: 'Current day of year. Range is 001 to 366 (or 001 to 365 if not a leap year)',
        kind: CompletionItemKind.Constant,
    },
    '@year': {
        title: '@YEAR',
        documentation: 'Current four-digit year',
        kind: CompletionItemKind.Constant,
    },
    '#include-once': {
        title: '#include-once',
        documentation: 'Specifies that the current file should only be included once.',
        kind: CompletionItemKind.Constant,
    },
    '#include': {
        title: '#include',
        documentation: 'Includes a file in the current script.',
        kind: CompletionItemKind.Constant,
    },
    '#cs': {
        title: '#cs',
        documentation: 'Specify that an entire section of script should be commented out.',
        kind: CompletionItemKind.Constant,
    },
    '#comments-start': {
        title: '#comments-start',
        documentation: 'Specify that an entire section of script should be commented out.',
        kind: CompletionItemKind.Constant,
    },
    '#ce': {
        title: '#ce',
        documentation: 'End of a comment section.',
        kind: CompletionItemKind.Constant,
    },
    '#comments-end': {
        title: '#comments-end',
        documentation: 'End of a comment section.',
        kind: CompletionItemKind.Constant,
    },
    '#NoTrayIcon': {
        title: '#NoTrayIcon',
        documentation: 'Indicates that the AutoIt tray icon will not be shown when the script starts.',
        kind: CompletionItemKind.Constant,
    },
    '#OnAutoItStartRegister': {
        title: '#OnAutoItStartRegister',
        documentation: 'Registers a function to be called when AutoIt starts.',
        kind: CompletionItemKind.Constant,
    },
    '#pragma': {
        title: '#pragma',
        documentation: 'A special directive for controlling aspects of how the script is compiled.',
        kind: CompletionItemKind.Constant,
    },
    '#RequireAdmin': {
        title: '#RequireAdmin',
        documentation: 'Specifies that the current script requires full administrator rights to run.',
        kind: CompletionItemKind.Constant,
    },
    '#ignorefunc': {
        title: '#ignorefunc',
        documentation: 'Specifies that the current function should be ignored by Au3Check.',
        kind: CompletionItemKind.Constant,
    },
    '#forceref': {
        title: '#forceref',
        documentation: 'Specifies that a variable should be seen as referenced by Au3Check.',
        kind: CompletionItemKind.Constant,
    },
    '#forcedef': {
        title: '#forcedef',
        documentation: 'Specifies that a variable should be seen as defined by Au3Check.',
        kind: CompletionItemKind.Constant,
    },
} as documentationCollection;
