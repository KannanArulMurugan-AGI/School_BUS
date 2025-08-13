package com.example.driverapp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.driverapp.adapters.RouteAdapter
import com.example.driverapp.databinding.ActivityRouteSelectionBinding
import com.example.driverapp.models.Route
import com.google.firebase.database.*

class RouteSelectionActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRouteSelectionBinding
    private var tenantId: String? = null
    private lateinit var database: FirebaseDatabase
    private lateinit var routesRef: DatabaseReference
    private lateinit var routeAdapter: RouteAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRouteSelectionBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tenantId = intent.getStringExtra(EXTRA_TENANT_ID)
        if (tenantId == null) {
            Log.e(TAG, "Tenant ID is missing!")
            Toast.makeText(this, "Error: Tenant ID is missing.", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        database = FirebaseDatabase.getInstance()
        routesRef = database.getReference("schools/$tenantId/routes")

        setupRecyclerView()
        fetchRoutes()
    }

    private fun setupRecyclerView() {
        routeAdapter = RouteAdapter { route ->
            val intent = Intent(this, TrackingActivity::class.java).apply {
                putExtra(TrackingActivity.EXTRA_TENANT_ID, tenantId)
                putExtra(TrackingActivity.EXTRA_ROUTE_ID, route.id)
            }
            startActivity(intent)
        }
        binding.routesRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@RouteSelectionActivity)
            adapter = routeAdapter
        }
    }

    private fun fetchRoutes() {
        binding.progressBar.visibility = View.VISIBLE
        binding.routesRecyclerView.visibility = View.GONE
        binding.emptyView.visibility = View.GONE

        routesRef.addListenerForSingleValueEvent(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                val routes = mutableListOf<Route>()
                if (snapshot.exists()) {
                    for (routeSnapshot in snapshot.children) {
                        val route = routeSnapshot.getValue(Route::class.java)
                        if (route != null) {
                            route.id = routeSnapshot.key ?: ""
                            routes.add(route)
                        }
                    }
                }
                updateUI(routes)
            }

            override fun onCancelled(error: DatabaseError) {
                Log.e(TAG, "Failed to fetch routes", error.toException())
                Toast.makeText(this@RouteSelectionActivity, "Failed to load routes.", Toast.LENGTH_SHORT).show()
                binding.progressBar.visibility = View.GONE
                binding.emptyView.visibility = View.VISIBLE
            }
        })
    }

    private fun updateUI(routes: List<Route>) {
        binding.progressBar.visibility = View.GONE
        if (routes.isEmpty()) {
            binding.emptyView.visibility = View.VISIBLE
            binding.routesRecyclerView.visibility = View.GONE
        } else {
            binding.emptyView.visibility = View.GONE
            binding.routesRecyclerView.visibility = View.VISIBLE
            routeAdapter.submitList(routes)
            Log.d(TAG, "Routes loaded: ${routes.size}")
        }
    }


    companion object {
        const val EXTRA_TENANT_ID = "extra_tenant_id"
        private const val TAG = "RouteSelectionActivity"
    }
}
