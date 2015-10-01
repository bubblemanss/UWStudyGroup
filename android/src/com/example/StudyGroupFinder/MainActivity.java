package com.example.StudyGroupFinder;

import android.app.Activity;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends Activity {
    /**
     * Called when the activity is first created.
     */
    Button searchButton;
    Button createButton;
    EditText searchBar;
    EditText createCode;
    EditText createBuilding;
    EditText createRoom;
    EditText createPeople;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        Log.d("DEBUGKAI", "Before post request");
        searchButton = (Button) findViewById(R.id.search_button);
        createButton = (Button) findViewById(R.id.create_button);
        searchBar = (EditText) findViewById(R.id.search_bar);
        createCode = (EditText) findViewById(R.id.code);
        createBuilding = (EditText) findViewById(R.id.building);
        createRoom = (EditText) findViewById(R.id.room);
        createPeople = (EditText) findViewById(R.id.people);
        ConnectivityManager connMgr = (ConnectivityManager)
                getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
        Log.d("DEBUGKAI", "After networkInfo");

        final MainActivity mainActivity = this;

        if (networkInfo != null && networkInfo.isConnected()) {
            searchButton.setOnClickListener(
                    new View.OnClickListener() {
                        public void onClick(View view) {
                            String text = searchBar.getText().toString();
                            new PostRequestLookup(mainActivity).execute("http://uwstudygroup.herokuapp.com/lookup", text);
                        }
                    }
            );
            createButton.setOnClickListener(
                    new View.OnClickListener() {
                        public void onClick(View view) {
                            String code = createCode.getText().toString();
                            String building = createBuilding.getText().toString();
                            String room = createRoom.getText().toString();
                            String people = createPeople.getText().toString();
                            if ((code != "" || code != null) && (building != "" || building != null) && (room != "" || room != null) && (people != "" || people != null)) {
                                new PostRequestCreate(mainActivity).execute("http://uwstudygroup.herokuapp.com/create", code, building, room, people);
                            } else {
                                TextView t =(TextView) findViewById(R.id.error_msgs);
                                t.setText("Please fill all fields.");
                            }
                        }
                    }
            );
        } else {
            // display error
            Log.d("DEBUGKAI", "Network Not OK");
        }

    }


}
