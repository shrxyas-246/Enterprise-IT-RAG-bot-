# VPN Access and Troubleshooting Guide

**Owner:** IT Service Desk
**Applies to:** All employees and contractors
**Last reviewed:** 2026-09-15
**Document ID:** IT-KB-VPN-001

## 1. Overview

The company VPN (SecureConnect) gives remote users encrypted access to internal systems such as the HR portal, finance applications, internal wikis, file shares and the ticketing system. Public cloud tools such as email and chat do not need the VPN.

The VPN must be used whenever you work from outside a company office, including home networks, hotels, airports and coffee shops.

## 2. Who Gets VPN Access

- All full-time employees receive VPN access automatically on their first day.
- Contractors receive VPN access only after their manager submits an access request in the IT portal under **Access > Remote Access**.
- Contractor VPN access expires at the end of the contract date and must be renewed by the manager.
- Interns receive VPN access for the duration of their internship only.

## 3. Installing the VPN Client

1. Open the **Company Software Center** on your laptop.
2. Search for **SecureConnect VPN** and click **Install**.
3. Restart your laptop after installation finishes.
4. Open SecureConnect and enter the portal address: `vpn.company.internal`.
5. Sign in with your company email and password, then approve the MFA prompt.

Personal devices are not allowed to install the VPN client. Only company-managed laptops are supported.

## 4. Connecting to the VPN

1. Make sure you are connected to the internet.
2. Open SecureConnect from the system tray (Windows) or menu bar (macOS).
3. Click **Connect** and select the gateway closest to you:
   - **India-Chennai** — for users in India
   - **US-East** — for users in North America
   - **EU-Frankfurt** — for users in Europe
4. Approve the MFA push notification on your phone within 60 seconds.
5. A green shield icon means you are connected.

VPN sessions automatically disconnect after **12 hours**, or after **30 minutes of inactivity**. Reconnect to continue working.

## 5. Common Errors and Fixes

| Error code | Message | Fix |
|---|---|---|
| VPN-401 | Authentication failed | Check your password. If you recently changed it, wait 15 minutes for it to sync, then try again. |
| VPN-403 | Access denied | Your account does not have VPN access. Contractors should ask their manager to submit an access request. |
| VPN-408 | MFA timeout | You did not approve the MFA prompt within 60 seconds. Click Connect again and approve the prompt faster. |
| VPN-500 | Gateway unavailable | The selected gateway may be down. Try another gateway and check the IT status page. |
| VPN-610 | Certificate error | Your device certificate has expired. Open Company Software Center and run **Refresh Device Certificate**. |
| VPN-720 | Client out of date | Update SecureConnect from Company Software Center. Versions older than 6.2 are blocked. |

## 6. General Troubleshooting Steps

If the VPN will not connect and the error is not listed above, try these steps in order:

1. Disconnect and reconnect to your Wi-Fi or switch to a mobile hotspot.
2. Quit SecureConnect fully and open it again.
3. Restart your laptop.
4. Check that your laptop date and time are set automatically. A wrong clock causes certificate errors.
5. Temporarily disable any personal firewall or third-party antivirus that may block the VPN.
6. Check the IT status page at `status.company.internal` for known outages.

## 7. Slow VPN Performance

- Use the gateway closest to your physical location.
- Avoid streaming video or large personal downloads while on the VPN.
- Split tunneling is enabled: Microsoft 365, Zoom and Slack traffic goes directly to the internet and does not slow the VPN.
- If speeds are below 5 Mbps on a stable home connection, raise a ticket with your speed test results attached.

## 8. Escalation and Support

- Raise a ticket in the IT portal under **Network > VPN Issue**.
- For urgent issues that block work, call the IT Service Desk at extension **4357** (HELP).
- Service Desk hours: 24 hours a day, 7 days a week.
- Target response time: **P1 (cannot work)** within 30 minutes; **P2 (degraded)** within 4 hours; **P3 (question)** within 1 business day.

## 9. Security Rules

- Never share your VPN session or credentials with anyone.
- Do not use the VPN on public shared computers.
- Report a lost or stolen laptop to IT Security within 1 hour at `security@company.internal` so VPN access can be revoked.
