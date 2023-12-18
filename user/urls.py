from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    UserRegistrationView,
    CustomTokenObtainPairView,
    UserDetailsView,
    PutUserProfile
)


urlpatterns = [
    path("registration/", UserRegistrationView.as_view(), name="user_registration"),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("user/", UserDetailsView.as_view(), name="user-details"),
    # user edit url
    path("update-user/", PutUserProfile.as_view(), name="PutUserProfile"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
