/*
 * data.js - all guide content lives here.
 *
 * HOW TO EDIT
 *  - meta.help        : your service desk contact details
 *  - tools[].downloads: official download links per OS
 *  - tools[].steps    : { windows: [...], mac: [...], chromeos: [...] }
 *  - a step supports: title, body (supports **bold** and `code`), note (callout),
 *    code (copyable command), art (illustration spec), img (real screenshot path)
 *
 * Illustration kinds: download | files | install | store | permissions |
 *                     session | request | terminal | drag | checklist
 */
window.GUIDE = {
  meta: {
    title: "Remote Support Tool Guide",
    subtitle: "Install & connect, step by step, with pictures",
    updated: "23 Nov 2026",
    owner: "IT Support",
    help: {
      phone: "ext. 0000",
      email: "support@example.com",
      hours: "Mon–Fri, 08:00–18:00"
    }
  },

  osList: [
    { id: "windows", name: "Windows", short: "Windows" },
    { id: "mac", name: "macOS", short: "Mac" },
    { id: "chromeos", name: "ChromeOS", short: "Chrome OS" }
  ],

  tools: [
    /* ------------------------------------------------------------------ */
    {
      id: "anydesk",
      name: "AnyDesk",
      initials: "A",
      accent: "#e11d48",
      vendor: "AnyDesk Software GmbH",
      tagline: "Lightweight remote desktop · 9-digit ID + accept prompt",
      official: "https://anydesk.com/",
      summary:
        "The most common support tool. You only need the **9-digit ID** shown in the AnyDesk window — no account and no settings.",
      requirements: [
        "The 9-digit ID from the AnyDesk window",
        "Your IT agent available on chat or phone",
        "Administrator rights on the PC (Windows only, when IT asks you to install)"
      ],
      downloads: {
        windows: { url: "https://anydesk.com/en/downloads", label: "Download for Windows" },
        mac: { url: "https://anydesk.com/en/downloads/mac-os", label: "Download for macOS" },
        chromeos: {
          url: "https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid",
          label: "Open Google Play"
        }
      },
      steps: {
        windows: [
          {
            title: "Open the official AnyDesk download page",
            body:
              "In your browser go to **anydesk.com → Downloads → Windows**, or use the download button above. Only download AnyDesk from the official website or from a link your IT team sent you.",
            art: {
              kind: "download",
              url: "anydesk.com/downloads",
              button: "Download",
              heading: "AnyDesk for Windows",
              sub: "Windows · 10 / 11 · 64-bit · a few MB"
            }
          },
          {
            title: "Run the file you downloaded",
            body:
              "Open the **Downloads** folder (or click the file in the browser download bar) and double-click **AnyDesk.exe**. If Windows SmartScreen appears, click **More info → Run anyway** — the file is digitally signed.",
            art: {
              kind: "files",
              file: "AnyDesk.exe",
              meta: "Application · 6.3 MB",
              hint: "If Windows asks for permission, click Yes."
            }
          },
          {
            title: "Install AnyDesk",
            body:
              "Click **Install** and confirm the Windows UAC prompt with **Yes**. Installing puts AnyDesk in the Start menu. If you prefer not to install anything, choose **Run** instead — it works without installation.",
            art: {
              kind: "install",
              title: "AnyDesk Setup",
              button: "Install",
              option: "Install AnyDesk for this computer",
              sub: "UAC prompt → click Yes"
            }
          },
          {
            title: "Read out your AnyDesk ID",
            body:
              "The main window shows a **9-digit number** under *This desk* (for example `123 456 789`). Send this number to the IT agent who is helping you — it is the only thing they need to connect.",
            note:
              "Never post your ID in a public chat, forum or social media. Share it only with your IT agent.",
            art: { kind: "session", id: "123 456 789", label: "Your ID" }
          },
          {
            title: "Accept the remote session",
            body:
              "When IT connects, an incoming request window appears. Check that the name matches the agent you are talking to, then click **Accept**. If you did not ask for support, click **Deny** and contact IT.",
            art: {
              kind: "request",
              name: "IT Support",
              sub: "is requesting remote control"
            }
          },
          {
            title: "Finish and close AnyDesk",
            body:
              "After the work is done, close AnyDesk (right-click the tray icon → **Exit**) so nobody can reconnect. Leave *Start AnyDesk on login* switched off unless IT asked you to keep it installed permanently.",
            art: {
              kind: "checklist",
              heading: "Before you finish",
              items: [
                "The agent confirmed the job is done",
                "AnyDesk closed from the tray icon",
                "No permanent password was saved"
              ]
            }
          }
        ],
        mac: [
          {
            title: "Download the macOS package",
            body:
              "Open **anydesk.com → Downloads → macOS** and download the `.dmg` file. Both Apple Silicon (M1–M4) and Intel Macs are supported by the same file.",
            art: {
              kind: "download",
              url: "anydesk.com/downloads/mac-os",
              button: "Download",
              heading: "AnyDesk for macOS",
              sub: "macOS 11 or newer · .dmg file"
            }
          },
          {
            title: "Drag AnyDesk into Applications",
            body:
              "Double-click **AnyDesk.dmg**, then drag the AnyDesk icon into the **Applications** folder. Eject the disk image afterwards (drag it to the Trash).",
            art: {
              kind: "drag",
              file: "AnyDesk.dmg",
              target: "Applications",
              hint: "First time? You may need to right-click → Open."
            }
          },
          {
            title: "Allow Screen Recording and Accessibility",
            body:
              "macOS blocks remote control until you allow it: **System Settings → Privacy & Security → Screen Recording** and **Accessibility** — switch **AnyDesk** on in both lists. If macOS asks to quit and reopen the app, click **Quit & Reopen**.",
            note:
              "These two permissions are mandatory on macOS. Without them the agent sees a black screen.",
            art: {
              kind: "permissions",
              heading: "Privacy & Security",
              rows: [
                { label: "Screen Recording", on: false, hint: "Turn this on" },
                { label: "Accessibility", on: false, hint: "Turn this on" }
              ],
              footer: "You may be asked to reopen AnyDesk after switching these on."
            }
          },
          {
            title: "Read out your AnyDesk ID",
            body:
              "Open **AnyDesk** from Launchpad or Applications. The window shows your **9-digit ID** — send it to the IT agent.",
            art: { kind: "session", id: "123 456 789", label: "Your ID" }
          },
          {
            title: "Accept the incoming session",
            body:
              "A macOS permission dialog may appear the first time (Screen Recording). Allow it, then click **Accept** in the AnyDesk request window.",
            art: { kind: "request", name: "IT Support", sub: "is requesting remote control" }
          },
          {
            title: "Quit AnyDesk when you are done",
            body:
              "Choose **AnyDesk → Quit AnyDesk** (or press `Cmd + Q`) so the session cannot be restarted without you.",
            art: {
              kind: "checklist",
              heading: "Before you finish",
              items: [
                "The agent confirmed the job is done",
                "AnyDesk quit (Cmd + Q)",
                "Screen Recording / Accessibility left enabled"
              ]
            }
          }
        ],
        chromeos: [
          {
            title: "Install AnyDesk from the Play Store",
            body:
              "Open the **Google Play Store** on your Chromebook, search for **AnyDesk** (publisher *AnyDesk Software GmbH*) and click **Install**. Android apps run in their own window on ChromeOS.",
            note:
              "If the Play Store is missing on a managed device, jump to the Linux option below (step 4).",
            art: {
              kind: "store",
              app: "AnyDesk",
              initials: "A",
              sub: "Android app · works on ChromeOS",
              hint: "Tap Open when the install finishes."
            }
          },
          {
            title: "Allow the app permissions",
            body:
              "Open **AnyDesk** from the launcher and tap through the welcome screens. If Android asks to **display over other apps**, allow it — that is what shows the floating toolbar.",
            art: {
              kind: "permissions",
              rows: [
                { label: "Display over other apps", on: false, hint: "Allow" },
                { label: "Notifications", on: false, hint: "Allow" }
              ],
              footer: "ChromeOS may also ask for microphone / camera access — only allow what IT requested."
            }
          },
          {
            title: "Read out your AnyDesk ID",
            body:
              "Your **9-digit ID** is shown at the top of the AnyDesk window. Send it to the IT agent in the chat or ticket.",
            art: { kind: "session", id: "123 456 789", label: "Your ID" }
          },
          {
            title: "No Play Store? Use the Linux container",
            body:
              "Go to **Settings → Advanced → Developers → Linux → Turn on** and wait for the container to finish setup. Then download the Debian package from anydesk.com and run it in the Terminal.",
            code: "sudo apt install ./Downloads/anydesk_*.deb",
            note:
              "The Linux container is a one-time setup (2–5 minutes). IT can do this with you on the phone.",
            art: {
              kind: "terminal",
              lines: ["sudo apt update", "sudo apt install ./Downloads/anydesk_*.deb"],
              comment: "# wait for the install to finish"
            }
          },
          {
            title: "Accept the session and close the app",
            body:
              "Tap **Accept** when IT connects, then close AnyDesk from the ChromeOS app window (the × in the title bar) when the work is finished.",
            art: {
              kind: "request",
              name: "IT Support",
              sub: "is requesting remote control"
            }
          }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      id: "hoptodesk",
      name: "HopToDesk",
      initials: "H",
      accent: "#0284c7",
      vendor: "HopToDesk",
      tagline: "Free remote desktop · ID + password",
      official: "https://www.hoptodesk.com/",
      summary:
        "A free remote desktop tool used as a backup when AnyDesk is blocked. You share your **HopToDesk ID**; IT connects with your permission.",
      requirements: [
        "The HopToDesk ID shown in the app window",
        "Your IT agent available on chat or phone",
        "Administrator rights if the installer asks"
      ],
      downloads: {
        windows: { url: "https://www.hoptodesk.com/download", label: "Download for Windows" },
        mac: { url: "https://www.hoptodesk.com/download", label: "Download for macOS" },
        chromeos: { url: "https://www.hoptodesk.com/download", label: "Download / Play Store" }
      },
      steps: {
        windows: [
          {
            title: "Download HopToDesk",
            body:
              "Go to **hoptodesk.com/download**, choose the **Windows** version and save the installer. Use the official site or the link IT gave you.",
            art: {
              kind: "download",
              url: "hoptodesk.com/download",
              button: "Download",
              heading: "HopToDesk for Windows",
              sub: "Windows · 64-bit installer"
            }
          },
          {
            title: "Run the installer",
            body:
              "Double-click **HopToDesk-Setup.exe**, click **Next**, accept the licence, click **Install** and confirm the UAC prompt with **Yes**. Finish with **Finish**.",
            art: {
              kind: "install",
              title: "HopToDesk Setup",
              button: "Install",
              option: "Install HopToDesk for this user",
              sub: "UAC prompt → click Yes"
            }
          },
          {
            title: "Find your HopToDesk ID",
            body:
              "The HopToDesk window shows your **ID** at the top (for example `123456`). Send it to the IT agent who is helping you.",
            note:
              "Do not set a permanent password unless IT explicitly asks for unattended access.",
            art: { kind: "session", id: "123456", label: "Your HopToDesk ID" }
          },
          {
            title: "Accept the incoming connection",
            body:
              "When IT connects you will see a request window with the agent's name. Click **Accept** to allow the session.",
            art: { kind: "request", name: "IT Support", sub: "is requesting remote control" }
          },
          {
            title: "Optional: unattended access (only if IT asks)",
            body:
              "For future sessions without you present: **Settings → Security** → set a strong permanent password and send it through the approved channel (ticket or password manager).",
            note:
              "A permanent password means anyone with it can connect. Only create one when IT instructs you.",
            art: {
              kind: "permissions",
              rows: [
                { label: "Unattended access", on: false, hint: "Off by default" },
                { label: "Permanent password", on: false, hint: "Not set" }
              ]
            }
          },
          {
            title: "Close HopToDesk",
            body:
              "Right-click the HopToDesk tray icon → **Exit**, or simply close the window after the agent confirms the work is done.",
            art: {
              kind: "checklist",
              heading: "Before you finish",
              items: [
                "The agent confirmed the job is done",
                "HopToDesk closed from the tray icon",
                "Permanent password removed if you created one"
              ]
            }
          }
        ],
        mac: [
          {
            title: "Download the macOS disk image",
            body:
              "On **hoptodesk.com/download** choose **macOS** and save the `.dmg` file. Check with IT whether you need the Apple Silicon or Intel build.",
            art: {
              kind: "download",
              url: "hoptodesk.com/download",
              button: "Download",
              heading: "HopToDesk for macOS",
              sub: "macOS · .dmg file"
            }
          },
          {
            title: "Install into Applications",
            body:
              "Open the `.dmg`, drag **HopToDesk** into **Applications**, then eject the disk image. If macOS blocks the app: **System Settings → Privacy & Security → Open Anyway**.",
            art: {
              kind: "drag",
              file: "HopToDesk.dmg",
              target: "Applications",
              hint: "Drag the app icon into the Applications folder."
            }
          },
          {
            title: "Grant Screen Recording and Accessibility",
            body:
              "Open **System Settings → Privacy & Security** and switch **HopToDesk** on for **Screen Recording** and **Accessibility**. Reopen the app when macOS asks.",
            art: {
              kind: "permissions",
              heading: "Privacy & Security",
              rows: [
                { label: "Screen Recording", on: false, hint: "Turn this on" },
                { label: "Accessibility", on: false, hint: "Turn this on" }
              ]
            }
          },
          {
            title: "Read out your HopToDesk ID",
            body:
              "Launch HopToDesk and send the **ID** from the main window to your IT agent.",
            art: { kind: "session", id: "123456", label: "Your HopToDesk ID" }
          },
          {
            title: "Accept the session and quit afterwards",
            body:
              "Click **Accept** in the incoming request window, and choose **HopToDesk → Quit HopToDesk** (`Cmd + Q`) when the agent is done.",
            art: { kind: "request", name: "IT Support", sub: "is requesting remote control" }
          }
        ],
        chromeos: [
          {
            title: "Install HopToDesk from the Play Store",
            body:
              "Open the **Play Store**, search **HopToDesk** and tap **Install**. The Android version runs in a normal ChromeOS window.",
            art: {
              kind: "store",
              app: "HopToDesk",
              initials: "H",
              sub: "Android app · works on ChromeOS",
              hint: "Tap Open when the install finishes."
            }
          },
          {
            title: "Open the app and read your ID",
            body:
              "Launch HopToDesk, allow the permission prompts, then copy the **ID** shown in the app and send it to IT.",
            art: { kind: "session", id: "123456", label: "Your HopToDesk ID" }
          },
          {
            title: "No Play Store? Use the Linux container",
            body:
              "Enable **Settings → Advanced → Developers → Linux**, then download the Debian package from hoptodesk.com and install it in the Terminal.",
            code: "sudo apt install ./Downloads/hoptodesk_*.deb",
            art: {
              kind: "terminal",
              lines: ["sudo apt update", "sudo apt install ./Downloads/hoptodesk_*.deb"],
              comment: "# type Y and press Enter when asked"
            }
          },
          {
            title: "Accept the session and close the app",
            body:
              "Tap **Accept** when IT connects. Afterwards close HopToDesk from the window's × button.",
            art: { kind: "request", name: "IT Support", sub: "is requesting remote control" }
          }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      id: "ultraviewer",
      name: "UltraViewer",
      initials: "UV",
      accent: "#7c3aed",
      vendor: "Duc Fabulous Studio",
      tagline: "Windows only · ID + password",
      official: "https://www.ultraviewer.net/",
      note: "UltraViewer has no macOS or ChromeOS version. On those devices IT will switch you to AnyDesk, HopToDesk or RustDesk.",
      summary:
        "A very simple Windows remote tool: you give IT your **ID and password**, and they connect. Often used for quick one-off support sessions.",
      requirements: [
        "A Windows 10/11 PC",
        "Your ID and password from the UltraViewer window",
        "Administrator rights (the installer needs them)"
      ],
      limits: {
        mac: {
          reason:
            "UltraViewer is a Windows-only program — there is no macOS version. Any “UltraViewer for Mac” download you find online is fake and usually malicious.",
          alt: "anydesk"
        },
        chromeos: {
          reason:
            "UltraViewer is a Windows-only program — it cannot be installed on ChromeOS (no Android or Linux build).",
          alt: "rustdesk"
        }
      },
      downloads: {
        windows: { url: "https://www.ultraviewer.net/", label: "Download for Windows" },
        mac: { url: "https://www.ultraviewer.net/", label: "Windows only" },
        chromeos: { url: "https://www.ultraviewer.net/", label: "Windows only" }
      },
      steps: {
        windows: [
          {
            title: "Download UltraViewer",
            body:
              "Go to **ultraviewer.net** and click the **Download** button. Save the file to your Downloads folder.",
            art: {
              kind: "download",
              url: "ultraviewer.net",
              button: "Download",
              heading: "UltraViewer for Windows",
              sub: "Windows 7 / 10 / 11 · 32 & 64-bit"
            }
          },
          {
            title: "Install UltraViewer",
            body:
              "Double-click **UltraViewer_Setup.exe** → **Next** → accept the licence → **Install** → **Finish**. Confirm the UAC prompt with **Yes**.",
            art: {
              kind: "install",
              title: "UltraViewer Setup",
              button: "Install",
              option: "Create a desktop shortcut",
              sub: "UAC prompt → click Yes"
            }
          },
          {
            title: "Copy your ID and password",
            body:
              "The UltraViewer window shows your **ID** and **Password** in the *Your ID and Password* panel. Send both to IT over the approved channel (ticket, phone or chat) — never in a public group.",
            note:
              "The password is temporary and changes every time you restart UltraViewer, unless IT asks you to set a permanent one.",
            art: {
              kind: "session",
              id: "123 456 789",
              label: "Your ID",
              password: true,
              initials: "UV"
            }
          },
          {
            title: "Accept the connection",
            body:
              "IT enters your ID and password and connects. A window appears asking for permission — click **Accept / Allow**. If Windows Firewall asks, allow it on **private networks** only.",
            art: {
              kind: "request",
              name: "IT Support",
              sub: "wants to connect with your ID",
              accept: "Accept"
            }
          },
          {
            title: "Optional: allow file transfer",
            body:
              "If IT needs logs or screenshots from your PC, tick **File transfer** in the UltraViewer window before the session starts.",
            art: {
              kind: "permissions",
              rows: [
                { label: "Remote control", on: true, hint: "Enabled" },
                { label: "File transfer", on: false, hint: "Tick if IT needs files" }
              ]
            }
          },
          {
            title: "Close UltraViewer",
            body:
              "Close the window after the agent confirms the work is done. Do not leave the ID and password on screen for others to see.",
            art: {
              kind: "checklist",
              heading: "Before you finish",
              items: [
                "The agent confirmed the job is done",
                "UltraViewer closed",
                "Password not written down or shared"
              ]
            }
          }
        ],
        mac: [
          {
            title: "Confirm with IT which tool to use",
            body:
              "UltraViewer does not run on macOS. Tell the agent you are on a Mac — they will switch you to a supported tool and walk you through it.",
            art: {
              kind: "download",
              url: "ultraviewer.net",
              button: "Windows only",
              heading: "No macOS version exists",
              sub: "Do not download “UltraViewer for Mac” from third-party sites"
            }
          },
          {
            title: "Install a supported alternative",
            body:
              "The usual replacement is **AnyDesk for macOS**: download the `.dmg` from anydesk.com, drag the app into Applications, then allow **Screen Recording** and **Accessibility** in System Settings.",
            note:
              "Your agent will give you the ID to share. The rest of the flow (read out ID → accept request) is the same as UltraViewer.",
            art: {
              kind: "drag",
              file: "AnyDesk.dmg",
              target: "Applications",
              hint: "Alternative tool: AnyDesk for macOS"
            }
          },
          {
            title: "Read out the ID of the alternative tool",
            body:
              "Open the alternative tool and send the ID shown in its window to your IT agent, then accept the incoming request.",
            art: { kind: "session", id: "123 456 789", label: "Your ID" }
          }
        ],
        chromeos: [
          {
            title: "Confirm with IT which tool to use",
            body:
              "UltraViewer has no ChromeOS version (no Android app, no Linux build). IT will use a tool that works on ChromeOS instead.",
            art: {
              kind: "download",
              url: "ultraviewer.net",
              button: "Windows only",
              heading: "No ChromeOS version exists",
              sub: "Ask IT for the supported tool"
            }
          },
          {
            title: "Install the supported alternative",
            body:
              "**RustDesk** works well on Chromebooks: install it from the **Google Play Store**, or use the Linux container if the Play Store is disabled.",
            art: {
              kind: "store",
              app: "RustDesk",
              initials: "RD",
              sub: "Android app · works on ChromeOS",
              hint: "Tap Open when the install finishes."
            }
          },
          {
            title: "Share your ID with IT",
            body:
              "Open RustDesk, copy the **ID** and **password** shown in the app and send them to your agent, then accept the connection.",
            art: {
              kind: "session",
              id: "123 456 789",
              label: "Your ID",
              password: true
            }
          }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      id: "remoteviewer",
      name: "Remote Viewer",
      initials: "RV",
      accent: "#0891b2",
      vendor: "Remote Utilities (Viewer build)",
      tagline: "Viewer / Host build · confirm the exact build with IT",
      official: "https://www.remoteutilities.com/",
      verify: true,
      note:
        "“Remote Viewer” is not one single product. IT decides which build you need (Viewer = you help others, Host = others help you). Confirm before installing.",
      summary:
        "The viewer build used by your IT team (for example Remote Utilities Viewer). You install it, read out your **ID / connection code**, and IT connects to your PC.",
      requirements: [
        "A Windows PC (macOS support depends on the build IT provides)",
        "Your ID / connection code from the app",
        "The download link from IT — do not use random search results"
      ],
      limits: {
        chromeos: {
          reason:
            "There is no ChromeOS build of this viewer. IT will switch you to a tool that runs on ChromeOS (AnyDesk, HopToDesk or RustDesk).",
          alt: "anydesk"
        }
      },
      downloads: {
        windows: { url: "https://www.remoteutilities.com/", label: "Download from vendor site" },
        mac: { url: "https://www.remoteutilities.com/", label: "Download from vendor site" },
        chromeos: { url: "https://www.remoteutilities.com/", label: "No ChromeOS build" }
      },
      steps: {
        windows: [
          {
            title: "Download the viewer package",
            body:
              "Open the download page IT gave you (vendor site: **remoteutilities.com**) and download the **Viewer** package for Windows. If IT said *Host*, download the Host instead — installing the wrong one wastes time.",
            note:
              "If your organisation uses a different “Remote Viewer” product, update the link in js/data.js (tool id: remoteviewer).",
            art: {
              kind: "download",
              url: "remoteutilities.com/download",
              button: "Download",
              heading: "Remote Viewer · Windows",
              sub: "Windows 64-bit · confirm Viewer or Host with IT"
            }
          },
          {
            title: "Run the installer",
            body:
              "Double-click the downloaded file, click **Next**, accept the licence, choose the install folder and click **Install**. Confirm the UAC prompt with **Yes**, then **Finish**.",
            art: {
              kind: "install",
              title: "Remote Viewer Setup",
              button: "Install",
              option: "Install for this user only",
              sub: "UAC prompt → click Yes"
            }
          },
          {
            title: "Find your ID / connection code",
            body:
              "Open the viewer window. Your **Internet-ID** (connection code) is shown in the main window or in **General → ID**. Copy it and send it to IT.",
            art: {
              kind: "session",
              id: "123-456-789",
              label: "Your ID / connection code"
            }
          },
          {
            title: "Accept the incoming connection",
            body:
              "When the technician connects, a confirmation prompt appears in the viewer. Check the name, then click **Accept**. The remote desktop opens inside the viewer window.",
            art: {
              kind: "request",
              name: "IT Support",
              sub: "is requesting a remote session"
            }
          },
          {
            title: "End the session",
            body:
              "Use **Disconnect / Close session** inside the viewer when the agent is done, then close the app. Do not leave saved connections with passwords.",
            art: {
              kind: "checklist",
              heading: "Before you finish",
              items: [
                "The agent confirmed the job is done",
                "Session disconnected in the viewer",
                "No saved passwords in the connection list"
              ]
            }
          }
        ],
        mac: [
          {
            title: "Check whether IT supports macOS",
            body:
              "macOS support depends on which viewer build your organisation uses. Ask IT to confirm the version and send you the official `.dmg` link.",
            art: {
              kind: "download",
              url: "remoteutilities.com/download",
              button: "Download",
              heading: "Remote Viewer · macOS",
              sub: "Confirm the macOS build with IT first"
            }
          },
          {
            title: "Install the viewer",
            body:
              "Open the `.dmg` and drag the viewer into **Applications**. If macOS blocks it: **System Settings → Privacy & Security → Open Anyway**.",
            art: {
              kind: "drag",
              file: "Viewer.dmg",
              target: "Applications",
              hint: "Drag the viewer into Applications"
            }
          },
          {
            title: "Allow Screen Recording and Accessibility",
            body:
              "In **System Settings → Privacy & Security** switch the viewer on for **Screen Recording** and **Accessibility**, then reopen the app.",
            art: {
              kind: "permissions",
              heading: "Privacy & Security",
              rows: [
                { label: "Screen Recording", on: false, hint: "Turn this on" },
                { label: "Accessibility", on: false, hint: "Turn this on" }
              ]
            }
          },
          {
            title: "Share your ID and accept the session",
            body:
              "Copy the **ID / connection code** from the viewer window, send it to IT, then click **Accept** when the connection request appears.",
            art: { kind: "session", id: "123-456-789", label: "Your ID / connection code" }
          }
        ],
        chromeos: [
          {
            title: "Confirm the alternative with IT",
            body:
              "This viewer has no ChromeOS build. IT will switch you to a ChromeOS-compatible tool and give you the matching guide.",
            art: {
              kind: "download",
              url: "remoteutilities.com/download",
              button: "No ChromeOS build",
              heading: "Use a supported tool instead",
              sub: "Ask IT which tool to install"
            }
          },
          {
            title: "Install the supported alternative",
            body:
              "Most ChromeOS sessions use **AnyDesk** or **RustDesk** from the Play Store. Follow the AnyDesk guide for ChromeOS (step 1–2).",
            art: {
              kind: "store",
              app: "AnyDesk",
              initials: "A",
              sub: "Android app · works on ChromeOS",
              hint: "Tap Open when the install finishes."
            }
          },
          {
            title: "Share your ID with IT",
            body:
              "Copy the **ID** from the alternative tool and send it to your agent, then accept the incoming request.",
            art: { kind: "session", id: "123 456 789", label: "Your ID" }
          }
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      id: "rustdesk",
      name: "RustDesk",
      initials: "RD",
      accent: "#ea580c",
      vendor: "RustDesk (open source)",
      tagline: "Open source · works on Windows, macOS and ChromeOS",
      official: "https://rustdesk.com/",
      summary:
        "An open-source remote desktop that runs on **every** platform in this guide, including ChromeOS. It often works without installing anything.",
      requirements: [
        "Your RustDesk ID and password",
        "Internet access (or the IT relay server address, if provided)",
        "Permission prompts on macOS (Screen Recording / Accessibility)"
      ],
      downloads: {
        windows: { url: "https://rustdesk.com/", label: "Download for Windows" },
        mac: { url: "https://rustdesk.com/", label: "Download for macOS" },
        chromeos: {
          url: "https://play.google.com/store/apps/details?id=com.carriez.flutter_rustdesk",
          label: "Open Google Play"
        }
      },
      steps: {
        windows: [
          {
            title: "Download RustDesk",
            body:
              "Go to **rustdesk.com** (or the IT-provided link) and download the **Windows** file. Both a portable `.exe` and an `.msi` installer are offered — either works.",
            art: {
              kind: "download",
              url: "rustdesk.com",
              button: "Download",
              heading: "RustDesk for Windows",
              sub: "Windows 8 / 10 / 11 · portable exe or msi"
            }
          },
          {
            title: "Run RustDesk",
            body:
              "Double-click **rustdesk-x86_64.exe** — the portable version needs no installation. If SmartScreen warns you, click **More info → Run anyway**. With the `.msi` file, follow the installer instead.",
            art: {
              kind: "files",
              file: "rustdesk-1.3.9-x86_64.exe",
              meta: "Application · portable, no install",
              hint: "Portable = just double-click and run."
            }
          },
          {
            title: "Copy your ID and password",
            body:
              "RustDesk shows a **9-digit ID** and a temporary **password** in the main window. Send both to IT over the approved channel.",
            note:
              "The temporary password changes when RustDesk restarts. Only set a permanent password when IT asks for unattended access.",
            art: {
              kind: "session",
              id: "123 456 789",
              label: "Your ID",
              password: true,
              initials: "RD"
            }
          },
          {
            title: "Accept the incoming connection",
            body:
              "When IT connects, click **Accept** in the RustDesk window. If RustDesk asks about the firewall, allow **private networks** only.",
            art: { kind: "request", name: "IT Support", sub: "is requesting remote control" }
          },
          {
            title: "Optional: permanent password",
            body:
              "Only if IT asks: **Settings → Security → Permanent password**, then share it through the ticket or password manager — never in a group chat.",
            art: {
              kind: "permissions",
              rows: [
                { label: "Permanent password", on: false, hint: "Only if IT asks" },
                { label: "Direct IP access", on: false, hint: "Leave off" }
              ]
            }
          },
          {
            title: "Close RustDesk",
            body:
              "Close the window (or right-click the tray icon → **Exit**) when the agent confirms the work is done.",
            art: {
              kind: "checklist",
              heading: "Before you finish",
              items: [
                "The agent confirmed the job is done",
                "RustDesk closed",
                "Temporary password not reused"
              ]
            }
          }
        ],
        mac: [
          {
            title: "Download the right macOS build",
            body:
              "On **rustdesk.com** pick the `.dmg` that matches your Mac: **Apple Silicon (aarch64)** for M1–M4, or **Intel (x86_64)** for older Macs. Not sure? Apple menu → About This Mac.",
            art: {
              kind: "download",
              url: "rustdesk.com",
              button: "Download",
              heading: "RustDesk for macOS",
              sub: "Choose Apple Silicon or Intel · .dmg file"
            }
          },
          {
            title: "Install RustDesk",
            body:
              "Open the `.dmg`, drag **RustDesk** into **Applications**, then eject the disk image. If macOS blocks the app: **System Settings → Privacy & Security → Open Anyway**.",
            art: {
              kind: "drag",
              file: "rustdesk.dmg",
              target: "Applications",
              hint: "Drag the app into the Applications folder"
            }
          },
          {
            title: "Grant Screen Recording and Accessibility",
            body:
              "Open **System Settings → Privacy & Security** and switch **RustDesk** on for **Screen Recording** and **Accessibility**. Reopen the app when macOS asks.",
            art: {
              kind: "permissions",
              heading: "Privacy & Security",
              rows: [
                { label: "Screen Recording", on: false, hint: "Turn this on" },
                { label: "Accessibility", on: false, hint: "Turn this on" }
              ],
              footer: "Input Monitoring is only needed if IT asks for it."
            }
          },
          {
            title: "Send your ID and password",
            body:
              "The RustDesk window shows your **ID** and **password** — send both to your IT agent, then click **Accept** when they connect.",
            art: {
              kind: "session",
              id: "123 456 789",
              label: "Your ID",
              password: true
            }
          },
          {
            title: "Quit RustDesk afterwards",
            body:
              "Choose **RustDesk → Quit RustDesk** (`Cmd + Q`) once the agent confirms the job is finished.",
            art: {
              kind: "checklist",
              heading: "Before you finish",
              items: [
                "The agent confirmed the job is done",
                "RustDesk quit (Cmd + Q)",
                "Permissions left enabled for next time"
              ]
            }
          }
        ],
        chromeos: [
          {
            title: "Install RustDesk from the Play Store",
            body:
              "Open the **Google Play Store**, search **RustDesk** (publisher *Purslane*) and tap **Install**. The Android version runs in a window on ChromeOS.",
            art: {
              kind: "store",
              app: "RustDesk",
              initials: "RD",
              sub: "Android app · works on ChromeOS",
              hint: "Tap Open when the install finishes."
            }
          },
          {
            title: "Open RustDesk and copy your ID",
            body:
              "Allow the permission prompts, then copy the **ID** and **password** from the app and send them to IT.",
            art: {
              kind: "session",
              id: "123 456 789",
              label: "Your ID",
              password: true
            }
          },
          {
            title: "No Play Store? Use the Linux container",
            body:
              "Enable **Settings → Advanced → Developers → Linux**, download the Debian package from rustdesk.com and install it in the Terminal.",
            code: "sudo apt install ./Downloads/rustdesk-*.deb",
            art: {
              kind: "terminal",
              lines: ["sudo apt update", "sudo apt install ./Downloads/rustdesk-*.deb"],
              comment: "# type Y and press Enter when asked"
            }
          },
          {
            title: "Accept the session and close the app",
            body:
              "Tap **Accept** when IT connects, then close RustDesk from the window's × button.",
            art: { kind: "request", name: "IT Support", sub: "is requesting remote control" }
          }
        ]
      }
    }
  ]
};