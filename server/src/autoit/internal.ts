import { CompletionItemKind } from "vscode-languageserver";

/**
 * @file file for providing intellisense information for internal AutoIt3 functions, macros and such.
 */

/** A documentation object used for intellisense. */
export type documentation = {
    title: string,
    detail: string,
    documentation: string,
    kind: CompletionItemKind,
}

/** A collection of documentaion object used for intellisense. */
export type documentationCollection = {
    [key: string]: documentation,
}

export default {
    'And': {
        title: "And",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'ByRef': {
        title: "ByRef",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Case': {
        title: "Case",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Const': {
        title: "Const",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'ContinueCase': {
        title: "ContinueCase",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'ContinueLoop': {
        title: "ContinueLoop",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Default': {
        title: "Default",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Dim': {
        title: "Dim",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Do': {
        title: "Do",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Else': {
        title: "Else",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'ElseIf': {
        title: "ElseIf",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'EndFunc': {
        title: "EndFunc",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'EndIf': {
        title: "EndIf",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'EndSelect': {
        title: "EndSelect",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'EndSwitch': {
        title: "EndSwitch",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'EndWith': {
        title: "EndWith",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Enum': {
        title: "Enum",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Exit': {
        title: "Exit",
        detail: "Exit ( [return code] )",
        documentation: "Terminates the script.",
        kind: CompletionItemKind.Function
    },
    'ExitLoop': {
        title: "ExitLoop",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'For': {
        title: "For",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Func': {
        title: "Func",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Global': {
        title: "Global",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'If': {
        title: "If",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'In': {
        title: "In",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Local': {
        title: "Local",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Next': {
        title: "Next",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Not': {
        title: "Not",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Null': {
        title: "Null",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Or': {
        title: "Or",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Redim': {
        title: "Redim",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Return': {
        title: "Return",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Select': {
        title: "Select",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Static': {
        title: "Static",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Step': {
        title: "Step",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Switch': {
        title: "Switch",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Then': {
        title: "Then",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'To': {
        title: "To",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Until': {
        title: "Until",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'Volatile': {
        title: "Volatile",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'WEnd': {
        title: "WEnd",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'While': {
        title: "While",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
    'With': {
        title: "With",
        detail: "",
        documentation: "",
        kind: CompletionItemKind.Keyword
    },
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
        documentation: 'Status of the error flag. See the function SetError().',
        kind: CompletionItemKind.Constant
    },
    '@exitcode': {
        title: '@exitCode',
        detail: '@exitCode',
        documentation: 'Exit code as set by Exit statement.',
        kind: CompletionItemKind.Constant
    },
    '@exitmethod': {
        title: '@exitMethod',
        detail: '@exitMethod',
        documentation: 'Exit method. See the function OnAutoItExitRegister().',
        kind: CompletionItemKind.Constant
    },
    '@extended': {
        title: '@extended',
        detail: '@extended',
        documentation: 'Extended function return - used in certain functions such as StringReplace().',
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
        documentation: 'Last click GUI Control handle. Only valid in an event Function. See the GUICtrlSetOnEvent() function.',
        kind: CompletionItemKind.Constant
    },
    '@gui_ctrlid': {
        title: '@GUI_CtrlId',
        detail: '@GUI_CtrlId',
        documentation: 'Last click GUI Control identifier. Only valid in an event Function. See the GUICtrlSetOnEvent() function.',
        kind: CompletionItemKind.Constant
    },
    '@gui_dragfile': {
        title: '@GUI_DragFile',
        detail: '@GUI_DragFile',
        documentation: 'Filename of the file being dropped. Only valid on Drop Event. See the GUISetOnEvent() function.',
        kind: CompletionItemKind.Constant
    },
    '@gui_dragid': {
        title: '@GUI_DragId',
        detail: '@GUI_DragId',
        documentation: 'Drag GUI Control identifier. Only valid on Drop Event. See the GUISetOnEvent() function.',
        kind: CompletionItemKind.Constant
    },
    '@gui_dropid': {
        title: '@GUI_DropId',
        detail: '@GUI_DropId',
        documentation: 'Drop GUI Control identifier. Only valid on Drop Event. See the GUISetOnEvent() function.',
        kind: CompletionItemKind.Constant
    },
    '@gui_winhandle': {
        title: '@GUI_WinHandle',
        detail: '@GUI_WinHandle',
        documentation: 'Last click GUI window handle. Only valid in an event Function. See the GUICtrlSetOnEvent() function.',
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
        documentation: 'Last hotkey pressed. See the HotKeySet() function.',
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
        documentation: 'Returns code denoting Keyboard Layout. See [Appendix](https://www.autoitscript.com/autoit3/docs/appendix/OSLangCodes.htm) for possible values.',
        kind: CompletionItemKind.Constant
    },
    '@lf': {
        title: '@LF',
        detail: '@LF',
        documentation: 'Line feed, Chr(10); occasionally used for line breaks.',
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
        documentation: 'Returns code denoting Multi Language if available (Vista is OK by default). See [Appendix](https://www.autoitscript.com/autoit3/docs/appendix/OSLangCodes.htm) for possible values.',
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
        documentation: 'Returns code denoting OS Language. See [Appendix](https://www.autoitscript.com/autoit3/docs/appendix/OSLangCodes.htm) for possible values.',
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
        documentation: 'Returns one of the following: "WIN_11", "WIN_10", "WIN_81", "WIN_8", "WIN_7", "WIN_VISTA", "WIN_XP", "WIN_XPe",\nfor Windows servers: "WIN_2019", "WIN_2022", "WIN_2016", "WIN_2012R2", "WIN_2012", "WIN_2008R2", "WIN_2008", "WIN_2003".',
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
        documentation: 'Tab character, Chr(9)',
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
        documentation: 'Last clicked item identifier during a TraySetOnEvent() or TrayItemSetOnEvent() action.',
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
    '#include-once': {
        title: '#include-once',
        detail: '#include-once',
        documentation: 'Specifies that the current file should only be included once.',
        kind: CompletionItemKind.Constant
    },
    '#include': {
        title: '#include',
        detail: '#include',
        documentation: 'Includes a file in the current script.',
        kind: CompletionItemKind.Constant
    },
    '#cs': {
        title: '#cs',
        detail: '#cs',
        documentation: 'Specify that an entire section of script should be commented out.',
        kind: CompletionItemKind.Constant
    },
    '#comments-start': {
        title: '#comments-start',
        detail: '#comments-start',
        documentation: 'Specify that an entire section of script should be commented out.',
        kind: CompletionItemKind.Constant
    },
    '#ce': {
        title: '#ce',
        detail: '#ce',
        documentation: 'End of a comment section.',
        kind: CompletionItemKind.Constant
    },
    '#comments-end': {
        title: '#comments-end',
        detail: '#comments-end',
        documentation: 'End of a comment section.',
        kind: CompletionItemKind.Constant
    },
    '#NoTrayIcon': {
        title: '#NoTrayIcon',
        detail: '#NoTrayIcon',
        documentation: 'Indicates that the AutoIt tray icon will not be shown when the script starts.',
        kind: CompletionItemKind.Constant
    },
    '#OnAutoItStartRegister': {
        title: '#OnAutoItStartRegister',
        detail: '#OnAutoItStartRegister',
        documentation: 'Registers a function to be called when AutoIt starts.',
        kind: CompletionItemKind.Constant
    },
    '#pragma': {
        title: '#pragma',
        detail: '#pragma',
        documentation: 'A special directive for controlling aspects of how the script is compiled.',
        kind: CompletionItemKind.Constant
    },
    '#RequireAdmin': {
        title: '#RequireAdmin',
        detail: '#RequireAdmin',
        documentation: 'Specifies that the current script requires full administrator rights to run.',
        kind: CompletionItemKind.Constant
    },
    '#ignorefunc': {
        title: '#ignorefunc',
        detail: '#ignorefunc',
        documentation: 'Specifies that the current function should be ignored by Au3Check.',
        kind: CompletionItemKind.Constant
    },
    '#forceref': {
        title: '#forceref',
        detail: '#forceref',
        documentation: 'Specifies that a variable should be seen as referenced by Au3Check.',
        kind: CompletionItemKind.Constant
    },
    '#forcedef': {
        title: '#forcedef',
        detail: '#forcedef',
        documentation: 'Specifies that a variable should be seen as defined by Au3Check.',
        kind: CompletionItemKind.Constant
    }
} as documentationCollection;
