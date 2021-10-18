import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MainGoogleMap extends StatefulWidget {
  final Map data;
  final Map<String, double> _currentLocation;
  MainGoogleMap(this.data, this._currentLocation);
  @override
  _MainGoogleMapState createState() => _MainGoogleMapState();
}

class _MainGoogleMapState extends State<MainGoogleMap> {
  Completer<GoogleMapController> _controller = Completer();
  Map<MarkerId, Marker> markers = <MarkerId, Marker>{};
  final Set<Marker> _markers = {};

  @override
  void initState() {
    super.initState();
    setMarkers(widget.data);
  }

  Set<Marker> setMarkers(Map<String, dynamic> data) {
    int i = 0;
    for (i = 0; i < data['allUser'].length; i++) {
      print(data['allUser'][i]['username']);
      final String markerIdVal = 'marker_id_$data["allUser"][i]["id"]';
      final MarkerId markerId = MarkerId(markerIdVal);

      final Marker marker = Marker(
        markerId: markerId,
        position: LatLng(data['allUser'][i]['location']['coordinates'][1],
            data['allUser'][i]['location']['coordinates'][0]),
        infoWindow: InfoWindow(
            title: data['allUser'][i]['email'],
            snippet: data['allUser'][i]['username']),
      );
      markers[markerId] = marker;
    }
    // setState(() {
    _markers.addAll(Set<Marker>.of(markers.values));
    // });
    return Set<Marker>.of(markers.values);
  }

  Future<void> _goToLocation(double lat, double long) async {
    final GoogleMapController controller = await _controller.future;
    controller.animateCamera(CameraUpdate.newCameraPosition(CameraPosition(
        target: LatLng(long, lat), zoom: 15, tilt: 50.0, bearing: 45.0)));
  }

  @override
  Widget build(BuildContext context) {
    return GoogleMap(
      mapType: MapType.normal,
      initialCameraPosition: CameraPosition(
          target: LatLng(widget._currentLocation['latitude'],
              widget._currentLocation['longitude']),
          zoom: 14.4746),
      onMapCreated: (GoogleMapController controller) {
        _controller.complete(controller);
      },
      markers: _markers,
    );
  }
}
