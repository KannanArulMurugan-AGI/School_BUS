package com.example.driverapp

import android.app.Application
import com.google.firebase.database.FirebaseDatabase

class DriverApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Enable Firebase offline persistence.
        // This must be done before any other Firebase Database operations.
        FirebaseDatabase.getInstance().setPersistenceEnabled(true)
    }
}
