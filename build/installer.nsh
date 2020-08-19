!macro preInit
    # SetRegView 32
    # WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BSZS"
    # WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BSZS"
    # SetRegView 64
    # WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BSZS"
    # WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\Program Files\BSZS"


    SetRegView 32
	ReadRegStr $0 HKLM "Software\WOW6432Node\BSZS" "InstPath"
    ${If} "$0" != ""
        Pop $0
	    StrCpy $INSTDIR "$0"
        WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation $INSTDIR
        WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation $INSTDIR
    ${EndIf}

    
    SetRegView 64
	ReadRegStr $0 HKLM "Software\WOW6432Node\BSZS" "InstPath"
    ${If} "$0" != ""
        Pop $0
	    StrCpy $INSTDIR "$0"
        WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation $INSTDIR
        WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation $INSTDIR
    ${EndIf}

!macroend