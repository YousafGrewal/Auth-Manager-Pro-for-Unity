// AuthManager.cs
// Minimal Unity client for AuthSystem Pro
using System;
using System.Text;
using System.Collections;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.Networking;

[Serializable]
public class AuthUser {
    public string id;
    public string email;
}

[Serializable]
public class LoginData {
    public string message;
    public string token;
    public string id;
    public string email;
}

[Serializable]
public class ApiResponseLogin {
    public bool success;
    public LoginData data;
}

[Serializable]
public class ApiResponseUser {
    public bool success;
    public AuthUser data;
}

public class AuthManager : MonoBehaviour
{
    public static AuthManager Instance;

    [Header("Configuration")]
    public string apiBaseURL = "http://localhost:8000";

    [Header("Events")]
    public UnityEvent onLoginSuccess;
    public UnityEvent onLogout;
    public UnityEvent<string> onAuthError;

    private string _token;
    private string _userId;

    void Awake() {
        if (Instance == null) {
            Instance = this;
            DontDestroyOnLoad(gameObject);
            LoadToken();
        } else {
            Destroy(gameObject);
        }
    }

    public bool IsAuthenticated => !string.IsNullOrEmpty(_token);
    public string Token => _token;
    public string UserId => _userId;

    public void Logout() {
        _token = null;
        _userId = null;
        PlayerPrefs.DeleteKey("auth_token");
        onLogout?.Invoke();
    }

    public IEnumerator Register(string email, string password) {
        var payload = JsonUtility.ToJson(new WrapperEmailPass{ email=email, password=password });
        yield return Post("/api/users/register", payload, (txt)=>{
            var resp = JsonUtility.FromJson<ApiResponseLogin>(txt);
            if (resp.success) {
                SaveToken(resp.data.token, resp.data.id);
                onLoginSuccess?.Invoke();
            } else {
                onAuthError?.Invoke("Register failed");
            }
        });
    }

    public IEnumerator Login(string email, string password) {
        var payload = JsonUtility.ToJson(new WrapperEmailPass{ email=email, password=password });
        yield return Post("/api/users/login", payload, (txt)=>{
            var resp = JsonUtility.FromJson<ApiResponseLogin>(txt);
            if (resp.success) {
                SaveToken(resp.data.token, resp.data.id);
                onLoginSuccess?.Invoke();
            } else {
                onAuthError?.Invoke("Login failed");
            }
        });
    }

    public IEnumerator ForgotPassword(string email) {
        var payload = JsonUtility.ToJson(new WrapperEmail{ email=email });
        yield return Post("/api/users/forgot-password", payload, (txt)=>{
            // no-op
        });
    }

    public IEnumerator ResetPassword(string token, string newPassword) {
        var payload = JsonUtility.ToJson(new WrapperReset{ token=token, password=newPassword });
        yield return Post("/api/users/reset-password", payload, (txt)=>{
            // no-op
        });
    }

    public IEnumerator Me(Action<AuthUser> cb) {
        var url = apiBaseURL + "/api/users/me";
        var req = UnityWebRequest.Get(url);
        req.SetRequestHeader("Authorization", "Bearer " + _token);
        yield return req.SendWebRequest();
        if (req.result == UnityWebRequest.Result.Success) {
            var resp = JsonUtility.FromJson<ApiResponseUser>(req.downloadHandler.text);
            cb?.Invoke(resp.data);
        } else {
            onAuthError?.Invoke("Me failed: " + req.error);
        }
    }

    private void SaveToken(string token, string userId) {
        _token = token;
        _userId = userId;
        PlayerPrefs.SetString("auth_token", token);
        PlayerPrefs.Save();
    }

    private void LoadToken() {
        _token = PlayerPrefs.GetString("auth_token", null);
    }

    [Serializable] private class WrapperEmailPass { public string email; public string password; }
    [Serializable] private class WrapperEmail { public string email; }
    [Serializable] private class WrapperReset { public string token; public string password; }

    private IEnumerator Post(string path, string json, Action<string> onSuccess) {
        var url = apiBaseURL + path;
        var req = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
        req.uploadHandler = new UploadHandlerRaw(bodyRaw);
        req.downloadHandler = new DownloadHandlerBuffer();
        req.SetRequestHeader("Content-Type", "application/json");
        yield return req.SendWebRequest();
        if (req.result == UnityWebRequest.Result.Success) {
            onSuccess?.Invoke(req.downloadHandler.text);
        } else {
            onAuthError?.Invoke("Request failed: " + req.error);
        }
    }
}
