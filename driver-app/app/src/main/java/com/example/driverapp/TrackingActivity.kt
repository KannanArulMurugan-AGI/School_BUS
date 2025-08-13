package com.example.driverapp

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Looper
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.example.driverapp.databinding.ActivityTrackingBinding
import com.google.android.gms.location.*
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import java.util.concurrent.TimeUnit

class TrackingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityTrackingBinding
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private lateinit var database: FirebaseDatabase
    private lateinit var databaseRef: DatabaseReference

    private var tenantId: String? = null
    private var routeId: String? = null

    private var isTracking = false

    private val locationPermissionRequest = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            startLocationUpdates()
        } else {
            Toast.makeText(this, "Location permission is required for tracking", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTrackingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tenantId = intent.getStringExtra(EXTRA_TENANT_ID)
        routeId = intent.getStringExtra(EXTRA_ROUTE_ID)

        if (tenantId == null || routeId == null) {
            Log.e(TAG, "Tenant ID or Route ID is missing!")
            Toast.makeText(this, "Error: Missing required data.", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        binding.routeInfoTextView.text = "Route: $routeId"

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        database = FirebaseDatabase.getInstance()
        databaseRef = database.getReference("schools/$tenantId/routes/$routeId/live")

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                locationResult.lastLocation?.let { location ->
                    Log.d(TAG, "New location: ${location.latitude}, ${location.longitude}")
                    updateLocationInFirebase(location.latitude, location.longitude)
                }
            }
        }

        binding.startTrackingButton.setOnClickListener {
            checkPermissionAndStartTracking()
        }

        binding.stopTrackingButton.setOnClickListener {
            stopLocationUpdates()
        }
    }

    private fun checkPermissionAndStartTracking() {
        when {
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED -> {
                startLocationUpdates()
            }
            else -> {
                locationPermissionRequest.launch(Manifest.permission.ACCESS_FINE_LOCATION)
            }
        }
    }

    private fun startLocationUpdates() {
        if (isTracking) return
        Log.d(TAG, "Starting location updates")

        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, TimeUnit.SECONDS.toMillis(10))
            .setWaitForAccurateLocation(false)
            .setMinUpdateIntervalMillis(TimeUnit.SECONDS.toMillis(5))
            .setMaxUpdateDelayMillis(TimeUnit.SECONDS.toMillis(15))
            .build()

        try {
            fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper())
            isTracking = true
            updateUI()
        } catch (e: SecurityException) {
            Log.e(TAG, "Failed to start location updates due to security exception.", e)
            Toast.makeText(this, "Permission was lost. Please grant permission again.", Toast.LENGTH_LONG).show()
        }
    }

    private fun stopLocationUpdates() {
        if (!isTracking) return
        Log.d(TAG, "Stopping location updates")

        fusedLocationClient.removeLocationUpdates(locationCallback)
        isTracking = false
        updateUI()
    }

    private fun updateLocationInFirebase(latitude: Double, longitude: Double) {
        val locationData = mapOf(
            "latitude" to latitude,
            "longitude" to longitude,
            "timestamp" to System.currentTimeMillis()
        )
        databaseRef.setValue(locationData)
            .addOnSuccessListener { Log.d(TAG, "Location updated in Firebase") }
            .addOnFailureListener { e -> Log.e(TAG, "Failed to update location in Firebase", e) }
    }

    private fun updateUI() {
        if (isTracking) {
            binding.trackingStatusTextView.text = "Tracking Active"
            binding.startTrackingButton.visibility = View.GONE
            binding.stopTrackingButton.visibility = View.VISIBLE
        } else {
            binding.trackingStatusTextView.text = "Tracking Inactive"
            binding.startTrackingButton.visibility = View.VISIBLE
            binding.stopTrackingButton.visibility = View.GONE
        }
    }

    override fun onStop() {
        super.onStop()
        if (isTracking) {
            stopLocationUpdates()
        }
    }

    companion object {
        const val EXTRA_TENANT_ID = "extra_tenant_id"
        const val EXTRA_ROUTE_ID = "extra_route_id"
        private const val TAG = "TrackingActivity"
    }
}
