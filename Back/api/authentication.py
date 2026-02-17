# api/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        cookie = request.COOKIES.get("access_token")
        if cookie is None:
            return None

        validated_token = self.get_validated_token(cookie)
        return self.get_user(validated_token), validated_token
