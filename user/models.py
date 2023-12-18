from django.db import models
from datetime import date
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError("User must have an email!")
        
        email = self.normalize_email(email)
        email = email.lower()
        
        user = self.model(
            email=email,
            **kwargs
        )

        user.set_password(password)
        user.save(using=self._db)
        
        return user
    
    def create_superuser(self, email, password=None, **kwargs):
        user = self.create_user(
            email,
            password=password,
            **kwargs
        )
        
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.save(using=self._db)
        
        return user
    

class UserAccount(AbstractBaseUser, PermissionsMixin):
    created_at = models.DateField(default=date.today)
    updated_at = models.DateField(default=date.today)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    phone_number = models.CharField(max_length=255, null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, blank=True)
    # password = models.CharField(max_length=255, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    objects = UserAccountManager()
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "UserAccount"
        verbose_name_plural = "UserAccounts"
        
    def __str__(self):
        return self.email

    # def save(self, commit=True):
    #     user = super().save(commit=False)
    #     user.set_password(self.cleaned_data[])
    
# Create your models here.
