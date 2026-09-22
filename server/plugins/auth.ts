import { createAuthPlugin } from "@agent-native/core/server";
import { signInJourneyInlineScript } from "@agent-native/core/shared";

const loginHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sign in · HRIMS</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f8fc; color: #172235; }
      * { box-sizing: border-box; }
      body { min-height: 100vh; display: grid; place-items: center; margin: 0; padding: 24px; background: linear-gradient(135deg, #eef6ff 0%, #f8fbff 52%, #f3f8f7 100%); }
      .auth-shell { width: min(100%, 940px); display: grid; grid-template-columns: 1.02fr .98fr; overflow: hidden; border: 1px solid #e4ebf4; border-radius: 22px; background: rgba(255,255,255,.9); box-shadow: 0 24px 70px rgba(30,66,108,.12); }
      .auth-intro { display: flex; flex-direction: column; justify-content: space-between; min-height: 590px; padding: 46px; color: #fff; background: linear-gradient(145deg, #126bd8 0%, #1976ed 52%, #2b9bca 100%); }
      .brand { display: flex; align-items: center; gap: 11px; }
      .brand-mark { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px; color: #1976ed; background: #fff; font-size: 20px; font-weight: 800; }
      .brand strong { display: block; font-size: 20px; letter-spacing: -.05em; }
      .brand span { display: block; margin-top: 3px; color: rgba(255,255,255,.72); font-size: 9px; }
      .intro-copy { max-width: 330px; }
      .intro-copy h1 { margin: 0; color: #fff; font-size: clamp(32px, 4vw, 46px); line-height: 1.04; letter-spacing: -.055em; }
      .intro-copy p { margin: 17px 0 0; color: rgba(255,255,255,.76); font-size: 14px; line-height: 1.55; }
      .intro-points { display: grid; gap: 10px; }
      .intro-point { display: flex; align-items: center; gap: 9px; color: rgba(255,255,255,.85); font-size: 11px; }
      .intro-point i { width: 22px; height: 22px; display: grid; place-items: center; border-radius: 7px; background: rgba(255,255,255,.15); font-style: normal; }
      .auth-card { display: flex; flex-direction: column; justify-content: center; padding: 46px; background: #fff; }
      .auth-card h2 { margin: 0; color: #172235; font-size: 25px; letter-spacing: -.045em; }
      .auth-card > p { margin: 8px 0 26px; color: #8492a5; font-size: 12px; }
      .mode-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; margin-bottom: 21px; border-radius: 9px; background: #f1f5fa; }
      .mode-toggle button { height: 31px; border: 0; border-radius: 6px; color: #8492a4; background: transparent; font: inherit; font-size: 11px; font-weight: 650; cursor: pointer; }
      .mode-toggle button.active { color: #1976ed; background: #fff; box-shadow: 0 2px 8px rgba(29,73,123,.1); }
      label { display: block; margin-bottom: 7px; color: #506078; font-size: 10px; font-weight: 700; }
      .field { margin-bottom: 16px; }
      input { width: 100%; height: 41px; padding: 0 12px; border: 1px solid #dce5ef; border-radius: 8px; outline: none; color: #25344b; background: #fbfdff; font: inherit; font-size: 12px; }
      input:focus { border-color: #1976ed; box-shadow: 0 0 0 3px rgba(25,118,237,.12); }
      .submit { width: 100%; height: 42px; margin-top: 2px; border: 0; border-radius: 8px; color: #fff; background: #1976ed; font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
      .submit:disabled { cursor: wait; opacity: .65; }
      .error { min-height: 18px; margin: 12px 0 0; color: #bf4b53; font-size: 10px; }
      .security-note { display: flex; gap: 8px; margin-top: 22px; padding: 11px; border: 1px solid #d9eafa; border-radius: 8px; color: #57708e; background: #f2f8ff; font-size: 10px; line-height: 1.4; }
      .security-note strong { display: block; color: #315f91; }
      @media (max-width: 720px) { body { padding: 0; } .auth-shell { min-height: 100vh; grid-template-columns: 1fr; border: 0; border-radius: 0; } .auth-intro { min-height: 250px; padding: 28px 24px; gap: 30px; } .intro-copy h1 { font-size: 32px; } .intro-copy p { margin-top: 10px; font-size: 12px; } .intro-points { display: none; } .auth-card { padding: 30px 24px 40px; } }
    </style>
  </head>
  <body>
    <main class="auth-shell">
      <section class="auth-intro" aria-label="HRIMS overview">
        <div class="brand"><div class="brand-mark">H</div><div><strong>HRIMS</strong><span>Human Resource Information System</span></div></div>
        <div class="intro-copy"><h1>People operations, clearly in view.</h1><p>Manage your workforce, payroll, attendance, and performance from one secure workspace.</p></div>
        <div class="intro-points"><div class="intro-point"><i>✓</i> Secure access for every HR role</div><div class="intro-point"><i>✓</i> Clear data for confident decisions</div><div class="intro-point"><i>✓</i> Built for teams that grow</div></div>
      </section>
      <section class="auth-card">
        <h2 id="form-title">Welcome back</h2>
        <p id="form-subtitle">Sign in to continue to HRIMS</p>
        <div class="mode-toggle" role="tablist" aria-label="Authentication mode"><button id="signin-tab" class="active" type="button" role="tab" aria-selected="true">Sign in</button><button id="signup-tab" type="button" role="tab" aria-selected="false">Create account</button></div>
        <form id="auth-form">
          <div class="field"><label for="email">Work email</label><input id="email" name="email" type="email" autocomplete="email" required placeholder="you@company.com" /></div>
          <div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" minlength="8" required placeholder="At least 8 characters" /></div>
          <button class="submit" id="submit" type="submit">Sign in</button>
          <p class="error" id="error" role="alert"></p>
        </form>
        <div class="security-note"><span aria-hidden="true">▣</span><div><strong>Protected workspace</strong>Your account and HR data are protected by secure sessions.</div></div>
      </section>
    </main>
    <script>${signInJourneyInlineScript()}</script>
    <script>
      (function () {
        var journey = __anCreateSignInJourney("", "/");
        var resumeHref = journey.journeyForLocation(window.location).resumeHref;
        var form = document.getElementById("auth-form");
        var submit = document.getElementById("submit");
        var error = document.getElementById("error");
        var title = document.getElementById("form-title");
        var subtitle = document.getElementById("form-subtitle");
        var signinTab = document.getElementById("signin-tab");
        var signupTab = document.getElementById("signup-tab");
        var signup = false;
        function setMode(next) {
          signup = next;
          signinTab.className = signup ? "" : "active";
          signupTab.className = signup ? "active" : "";
          signinTab.setAttribute("aria-selected", String(!signup));
          signupTab.setAttribute("aria-selected", String(signup));
          title.textContent = signup ? "Create your account" : "Welcome back";
          subtitle.textContent = signup ? "Set up your secure HRIMS workspace" : "Sign in to continue to HRIMS";
          submit.textContent = signup ? "Create account" : "Sign in";
          error.textContent = "";
        }
        signinTab.addEventListener("click", function () { setMode(false); });
        signupTab.addEventListener("click", function () { setMode(true); });
        form.addEventListener("submit", async function (event) {
          event.preventDefault();
          submit.disabled = true;
          error.textContent = "";
          var email = document.getElementById("email").value.trim();
          var password = document.getElementById("password").value;
          try {
            var endpoint = signup ? "/_agent-native/auth/register" : "/_agent-native/auth/login";
            var response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: email, password: password, callbackURL: resumeHref }) });
            var data = await response.json();
            if (!response.ok || !data.ok) throw new Error(data.error || "We couldn't complete that request.");
            if (signup) {
              var loginResponse = await fetch("/_agent-native/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: email, password: password }) });
              var loginData = await loginResponse.json();
              if (!loginResponse.ok || !loginData.ok) throw new Error(loginData.error || "Account created. Please sign in to continue.");
            }
            window.location.replace(resumeHref);
          } catch (requestError) {
            error.textContent = requestError instanceof Error ? requestError.message : "We couldn't complete that request.";
            submit.disabled = false;
          }
        });
      })();
    </script>
  </body>
</html>`;

export default createAuthPlugin({
  rootAuth: true,
  loginHtml,
});
