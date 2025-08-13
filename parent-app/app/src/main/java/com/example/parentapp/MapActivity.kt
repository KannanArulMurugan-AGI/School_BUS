package com.example.parentapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.MapView
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.Marker
import com.google.android.gms.maps.model.MarkerOptions
import com.google.firebase.database.*

class MapActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var mapView: MapView
    private lateinit var googleMap: GoogleMap
    private var busMarker: Marker? = null
    private lateinit var database: DatabaseReference

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)

        mapView = findViewById(R.id.mapView)
        mapView.onCreate(savedInstanceState)
        mapView.getMapAsync(this)
    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map
        startLocationUpdates()
    }

    private fun startLocationUpdates() {
        val sharedPref = getSharedPreferences("ParentAppPrefs", MODE_PRIVATE)
        val tenantId = sharedPref.getString("tenantId", null)
        val routeId = "route-1" // Hardcoded for now

        if (tenantId == null) {
            Log.e("MapActivity", "Tenant ID not found in SharedPreferences")
            // Handle this error, maybe navigate back to OnboardingActivity
            return
        }

        database = FirebaseDatabase.getInstance().getReference("/schools/$tenantId/routes/$routeId/live")

        val locationListener = object : ValueEventListener {
            override fun onDataChange(dataSnapshot: DataSnapshot) {
                val lat = dataSnapshot.child("lat").getValue(Double::class.java)
                val lng = dataSnapshot.child("lng").getValue(Double::class.java)

                if (lat != null && lng != null) {
                    val busLocation = LatLng(lat, lng)
                    updateMap(busLocation)
                }
            }

            override fun onCancelled(databaseError: DatabaseError) {
                Log.w("MapActivity", "loadPost:onCancelled", databaseError.toException())
            }
        }
        database.addValueEventListener(locationListener)
    }

    private fun updateMap(location: LatLng) {
        if (busMarker == null) {
            busMarker = googleMap.addMarker(MarkerOptions().position(location).title("Bus"))
            googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(location, 15f))
        } else {
            busMarker?.position = location
        }
    }

    override fun onResume() {
        super.onResume()
        mapView.onResume()
    }

    override fun onStart() {
        super.onStart()
        mapView.onStart()
    }

    override fun onStop() {
        super.onStop()
        mapView.onStop()
    }

    override fun onPause() {
        super.onPause()
        mapView.onPause()
    }

    override fun onLowMemory() {
        super.onLowMemory()
        mapView.onLowMemory()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        mapView.onSaveInstanceState(outState)
    }
}
