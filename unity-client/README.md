# Unity Client (AuthSystem Pro)
1. Import `AuthManager.cs` into your project.
2. Create an empty GameObject in your scene and attach `AuthManager`.
3. Set `apiBaseURL` (e.g., `http://localhost:8000`).
4. Use coroutines:
```csharp
StartCoroutine(AuthManager.Instance.Register(email, pass));
StartCoroutine(AuthManager.Instance.Login(email, pass));
```
