import { MapViewBase, BoundsBase, CircleBase, MarkerBase, PolygonBase, PolylineBase, ProjectionBase, PositionBase, latitudeProperty, VisibleRegionBase, longitudeProperty, bearingProperty, zoomProperty, tiltProperty, getColorHue } from "./map-view-common";
import { GC, layout } from "@nativescript/core/utils";
import { Image, ImageSource } from "@nativescript/core";
export * from "./map-view-common";
var IndoorDisplayDelegateImpl = /** @class */ (function (_super) {
    __extends(IndoorDisplayDelegateImpl, _super);
    function IndoorDisplayDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndoorDisplayDelegateImpl.initWithOwner = function (owner) {
        var handler = IndoorDisplayDelegateImpl.new();
        handler._owner = owner;
        return handler;
    };
    IndoorDisplayDelegateImpl.prototype.didChangeActiveBuilding = function (indoorBuilding) {
        var owner = this._owner.get();
        if (owner) {
            var data = null;
            if (indoorBuilding) {
                var levels = [];
                var count = 0;
                while (count < indoorBuilding.levels.count) {
                    levels.push({
                        name: indoorBuilding.levels[count].name,
                        shortName: indoorBuilding.levels[count].shortName,
                    });
                    count += 1;
                }
                data = {
                    defaultLevelIndex: indoorBuilding.defaultLevelIndex,
                    levels: levels,
                    isUnderground: indoorBuilding.underground,
                };
            }
            owner.notifyBuildingFocusedEvent(data);
        }
    };
    IndoorDisplayDelegateImpl.prototype.didChangeActiveLevel = function (activateLevel) {
        var owner = this._owner.get();
        if (owner) {
            var data = null;
            if (activateLevel) {
                data = {
                    name: activateLevel.name,
                    shortName: activateLevel.shortName,
                };
            }
            owner.notifyIndoorLevelActivatedEvent(data);
        }
    };
    IndoorDisplayDelegateImpl.ObjCProtocols = [GMSIndoorDisplayDelegate];
    return IndoorDisplayDelegateImpl;
}(NSObject));
var MapViewDelegateImpl = /** @class */ (function (_super) {
    __extends(MapViewDelegateImpl, _super);
    function MapViewDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapViewDelegateImpl.initWithOwner = function (owner) {
        var handler = MapViewDelegateImpl.new();
        handler._owner = owner;
        return handler;
    };
    MapViewDelegateImpl.prototype.mapViewIdleAtCameraPosition = function (mapView, cameraPosition) {
        var owner = this._owner.get();
        if (owner) {
            owner._processingCameraEvent = true;
            var cameraChanged = false;
            if (owner.latitude != cameraPosition.target.latitude) {
                cameraChanged = true;
                latitudeProperty.nativeValueChange(owner, cameraPosition.target.latitude);
            }
            if (owner.longitude != cameraPosition.target.longitude) {
                cameraChanged = true;
                longitudeProperty.nativeValueChange(owner, cameraPosition.target.longitude);
            }
            if (owner.bearing != cameraPosition.bearing) {
                cameraChanged = true;
                bearingProperty.nativeValueChange(owner, cameraPosition.bearing);
            }
            if (owner.zoom != cameraPosition.zoom) {
                cameraChanged = true;
                zoomProperty.nativeValueChange(owner, cameraPosition.zoom);
            }
            if (owner.tilt != cameraPosition.viewingAngle) {
                cameraChanged = true;
                tiltProperty.nativeValueChange(owner, cameraPosition.viewingAngle);
            }
            if (cameraChanged) {
                owner.notifyCameraEvent(MapViewBase.cameraChangedEvent, {
                    latitude: cameraPosition.target.latitude,
                    longitude: cameraPosition.target.longitude,
                    zoom: cameraPosition.zoom,
                    bearing: cameraPosition.bearing,
                    tilt: cameraPosition.viewingAngle
                });
            }
            owner._processingCameraEvent = false;
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidChangeCameraPosition = function (mapView, cameraPosition) {
        var owner = this._owner.get();
        owner.notifyCameraEvent(MapViewBase.cameraMoveEvent, {
            latitude: cameraPosition.target.latitude,
            longitude: cameraPosition.target.longitude,
            zoom: cameraPosition.zoom,
            bearing: cameraPosition.bearing,
            tilt: cameraPosition.viewingAngle
        });
    };
    MapViewDelegateImpl.prototype.mapViewDidTapAtCoordinate = function (mapView, coordinate) {
        var owner = this._owner.get();
        if (owner) {
            var position = Position.positionFromLatLng(coordinate.latitude, coordinate.longitude);
            owner.notifyPositionEvent(MapViewBase.coordinateTappedEvent, position);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidLongPressAtCoordinate = function (mapView, coordinate) {
        var owner = this._owner.get();
        if (owner) {
            var position = Position.positionFromLatLng(coordinate.latitude, coordinate.longitude);
            owner.notifyPositionEvent(MapViewBase.coordinateLongPressEvent, position);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidTapMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            if (marker) {
                owner.notifyMarkerTapped(marker);
            }
        }
        return false;
    };
    MapViewDelegateImpl.prototype.mapViewDidTapOverlay = function (mapView, gmsOverlay) {
        var owner = this._owner.get();
        if (owner) {
            var shape = owner.findShape(function (shape) { return shape.ios == gmsOverlay; });
            if (shape) {
                owner.notifyShapeTapped(shape);
            }
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidBeginDraggingMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerBeginDragging(marker);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidEndDraggingMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerEndDragging(marker);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidDragMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerDrag(marker);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidTapInfoWindowOfMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerInfoWindowTapped(marker);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidCloseInfoWindowOfMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerInfoWindowClosed(marker);
        }
    };
    MapViewDelegateImpl.prototype.didTapMyLocationButtonForMapView = function (mapView) {
        var owner = this._owner.get();
        if (owner) {
            owner.notifyMyLocationTapped();
            // Should return false in order to center the map on user position
            return false;
        }
        return true;
    };
    MapViewDelegateImpl.prototype.mapViewMarkerInfoWindow = function (mapView, gmsMarker) {
        return null;
    };
    MapViewDelegateImpl.prototype.mapViewMarkerInfoContents = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (!owner)
            return null;
        var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
        var content = owner._getMarkerInfoWindowContent(marker);
        if (content) {
            var width = Number(content.width);
            if (Number.isNaN(width))
                width = null;
            var height = Number(content.height);
            if (Number.isNaN(height))
                height = null;
            if (!height || !width) {
                var bounds = UIScreen.mainScreen.bounds;
                width = width || (bounds.size.width * .7);
                height = height || (bounds.size.height * .4);
            }
            this._layoutRootView(content, CGRectMake(0, 0, width, height));
            return content.ios;
        }
        return null;
    };
    /*
        Replacement for _layoutRootView method removed in NativeScript 6
    */
    MapViewDelegateImpl.prototype._layoutRootView = function (rootView, parentBounds) {
        if (!rootView || !parentBounds) {
            return;
        }
        var size = parentBounds.size;
        var width = layout.toDevicePixels(size.width);
        var height = layout.toDevicePixels(size.height);
        var widthSpec = layout.makeMeasureSpec(width, layout.EXACTLY);
        var heightSpec = layout.makeMeasureSpec(height, layout.EXACTLY);
        rootView.measure(widthSpec, heightSpec);
        var origin = parentBounds.origin;
        var left = origin.x;
        var top = origin.y;
        rootView.layout(left, top, width, height);
    };
    MapViewDelegateImpl.ObjCProtocols = [GMSMapViewDelegate];
    return MapViewDelegateImpl;
}(NSObject));
export class MapView extends MapViewBase {
    constructor() {
        super();
        this._markers = new Array();
        this.nativeView = GMSMapView.mapWithFrameCamera(CGRectZero, this._createCameraPosition());
        this._delegate = MapViewDelegateImpl.initWithOwner(new WeakRef(this));
        this._indoorDelegate = IndoorDisplayDelegateImpl.initWithOwner(new WeakRef(this));
        this.updatePadding();
    }
    onLoaded() {
        super.onLoaded();
        this.nativeView.delegate = this._delegate;
        this.nativeView.indoorDisplay.delegate = this._indoorDelegate;
        this.notifyMapReady();
    }
    onUnloaded() {
        this.nativeView.delegate = null;
        this.nativeView.indoorDisplay.delegate = null;
        super.onUnloaded();
    }
    disposeNativeView() {
        this._markers = null;
        this._delegate = null;
        this._indoorDelegate = null;
        super.disposeNativeView();
        GC();
    }
    ;
    _createCameraPosition() {
        return GMSCameraPosition.cameraWithLatitudeLongitudeZoomBearingViewingAngle(this.latitude, this.longitude, this.zoom, this.bearing, this.tilt);
    }
    updateCamera() {
        if (this.mapAnimationsEnabled) {
            this.nativeView.animateToCameraPosition(this._createCameraPosition());
        }
        else {
            this.nativeView.camera = this._createCameraPosition();
        }
    }
    setViewport(bounds, padding) {
        var p = UIEdgeInsetsMake(padding, padding, padding, padding) || this.gMap.padding;
        let cameraPosition = this.nativeView.cameraForBoundsInsets(bounds.ios, p);
        if (this.mapAnimationsEnabled) {
            this.nativeView.animateToCameraPosition(cameraPosition);
        }
        else {
            this.nativeView.camera = cameraPosition;
        }
    }
    updatePadding() {
        if (this.padding) {
            this.gMap.padding = UIEdgeInsetsMake(this.padding[0] || 0, this.padding[2] || 0, this.padding[1] || 0, this.padding[3] || 0);
        }
    }
    get ios() {
        throw new Error('Now use instance.nativeView instead of instance.ios');
    }
    get gMap() {
        return this.nativeView;
    }
    get projection() {
        return new Projection(this.nativeView.projection);
    }
    get settings() {
        return (this.nativeView) ? new UISettings(this.nativeView.settings) : null;
    }
    get myLocationEnabled() {
        return (this.nativeView) ? this.nativeView.myLocationEnabled : false;
    }
    set myLocationEnabled(value) {
        if (this.nativeView)
            this.nativeView.myLocationEnabled = value;
    }
    setMinZoomMaxZoom() {
        this.gMap.setMinZoomMaxZoom(this.minZoom, this.maxZoom);
    }
    addMarker(...markers) {
        if (!markers || !this._markers || !this.gMap)
            return null;
        markers.forEach(marker => {
            marker.ios.map = this.gMap;
            this._markers.push(marker);
        });
    }
    removeMarker(...markers) {
        if (!markers || !this._markers || !this.gMap)
            return null;
        markers.forEach(marker => {
            this._unloadInfoWindowContent(marker);
            marker.ios.map = null;
            this._markers.splice(this._markers.indexOf(marker), 1);
        });
    }
    removeAllMarkers() {
        if (!this._markers)
            return null;
        this._markers.forEach(marker => {
            this._unloadInfoWindowContent(marker);
            marker.ios.map = null;
        });
        this._markers = [];
    }
    findMarker(callback) {
        if (!this._markers)
            return null;
        return this._markers.find(callback);
    }
    addPolyline(shape) {
        if (!this._shapes)
            return null;
        shape.loadPoints();
        shape.ios.map = this.gMap;
        this._shapes.push(shape);
    }
    addPolygon(shape) {
        if (!this._shapes)
            return null;
        shape.ios.map = this.gMap;
        this._shapes.push(shape);
    }
    addCircle(shape) {
        if (!this._shapes)
            return null;
        shape.ios.map = this.gMap;
        this._shapes.push(shape);
    }
    removeShape(shape) {
        if (!this._shapes)
            return null;
        shape.ios.map = null;
        this._shapes.splice(this._shapes.indexOf(shape), 1);
    }
    removeAllShapes() {
        if (!this._shapes)
            return null;
        this._shapes.forEach(shape => {
            shape.ios.map = null;
        });
        this._shapes = [];
    }
    findShape(callback) {
        if (!this._shapes)
            return null;
        return this._shapes.find(callback);
    }
    clear() {
        this._markers = [];
        this.nativeView.clear();
    }
    setStyle(style) {
        try {
            this.nativeView.mapStyle = GMSMapStyle.styleWithJSONStringError(JSON.stringify(style));
            return true;
        }
        catch (err) {
            return false;
        }
    }
}
export class UISettings {
    constructor(ios) {
        this._ios = ios;
    }
    get ios() {
        return this._ios;
    }
    get compassEnabled() {
        return this._ios.compassButton;
    }
    set compassEnabled(value) {
        this._ios.compassButton = value;
    }
    get indoorLevelPickerEnabled() {
        return this._ios.indoorPicker;
    }
    set indoorLevelPickerEnabled(value) {
        this._ios.indoorPicker = value;
    }
    get mapToolbarEnabled() {
        return false;
    }
    set mapToolbarEnabled(value) {
        if (value)
            console.warn("Map toolbar not available on iOS");
    }
    get myLocationButtonEnabled() {
        return this._ios.myLocationButton;
    }
    set myLocationButtonEnabled(value) {
        this._ios.myLocationButton = value;
    }
    get rotateGesturesEnabled() {
        return this._ios.rotateGestures;
    }
    set rotateGesturesEnabled(value) {
        this._ios.rotateGestures = value;
    }
    get scrollGesturesEnabled() {
        return this._ios.scrollGestures;
    }
    set scrollGesturesEnabled(value) {
        this._ios.scrollGestures = value;
    }
    get tiltGesturesEnabled() {
        return this._ios.tiltGestures;
    }
    set tiltGesturesEnabled(value) {
        this._ios.tiltGestures = value;
    }
    get zoomControlsEnabled() {
        return false;
    }
    set zoomControlsEnabled(value) {
        if (value)
            console.warn("Zoom controls not available on iOS");
    }
    get zoomGesturesEnabled() {
        return this._ios.zoomGestures;
    }
    set zoomGesturesEnabled(value) {
        this._ios.zoomGestures = value;
    }
}
export class Projection extends ProjectionBase {
    constructor(ios) {
        super();
        this._ios = ios;
    }
    get ios() {
        return this._ios;
    }
    get visibleRegion() {
        return new VisibleRegion(this.ios.visibleRegion());
    }
    fromScreenLocation(point) {
        var location = this.ios.coordinateForPoint(CGPointMake(point.x, point.y));
        return new Position(location);
    }
    toScreenLocation(position) {
        var cgPoint = this.ios.pointForCoordinate(position.ios);
        return {
            x: cgPoint.x,
            y: cgPoint.y
        };
    }
}
export class VisibleRegion extends VisibleRegionBase {
    constructor(ios) {
        super();
        this._ios = ios;
    }
    get ios() {
        return this._ios;
    }
    get nearLeft() {
        return new Position(this.ios.nearLeft);
    }
    get nearRight() {
        return new Position(this.ios.nearRight);
    }
    get farLeft() {
        return new Position(this.ios.farLeft);
    }
    get farRight() {
        return new Position(this.ios.farRight);
    }
    get bounds() {
        return new Bounds(GMSCoordinateBounds.alloc().initWithRegion(this.ios));
    }
}
export class Bounds extends BoundsBase {
    constructor(ios) {
        super();
        this._ios = ios;
    }
    get ios() {
        return this._ios;
    }
    get southwest() {
        return new Position(this.ios.southWest);
    }
    get northeast() {
        return new Position(this._ios.northEast);
    }
    static fromCoordinates(southwest, northeast) {
        return new Bounds(GMSCoordinateBounds.alloc().initWithCoordinateCoordinate(southwest.ios, northeast.ios));
    }
}
export class Position extends PositionBase {
    constructor(ios) {
        super();
        this._ios = ios || CLLocationCoordinate2DMake(0, 0);
    }
    get ios() {
        return this._ios;
    }
    get latitude() {
        return this._ios.latitude;
    }
    set latitude(latitude) {
        this._ios = CLLocationCoordinate2DMake(latitude, this.longitude);
    }
    get longitude() {
        return this._ios.longitude;
    }
    set longitude(longitude) {
        this._ios = CLLocationCoordinate2DMake(this.latitude, longitude);
    }
    static positionFromLatLng(latitude, longitude) {
        let position = new Position();
        position.latitude = latitude;
        position.longitude = longitude;
        return position;
    }
}
export class Marker extends MarkerBase {
    constructor() {
        super();
        this._alpha = 1;
        this._visible = true;
        this._ios = GMSMarker.new();
    }
    static getIconForColor(hue) {
        const hueKey = hue.toFixed(8);
        if (!Marker.cachedColorIcons[hueKey]) {
            const icon = GMSMarker.markerImageWithColor(UIColor.colorWithHueSaturationBrightnessAlpha(hue, 1, 1, 1));
            Marker.cachedColorIcons[hueKey] = icon;
        }
        return Marker.cachedColorIcons[hueKey];
    }
    get position() {
        return new Position(this._ios.position);
    }
    set position(position) {
        this._ios.position = position.ios;
    }
    get rotation() {
        return this._ios.rotation;
    }
    set rotation(value) {
        this._ios.rotation = value;
    }
    get zIndex() {
        return this._ios.zIndex;
    }
    set zIndex(value) {
        this._ios.zIndex = value;
    }
    get title() {
        return this._ios.title;
    }
    set title(title) {
        this._ios.title = title;
    }
    get snippet() {
        return this._ios.snippet;
    }
    set snippet(snippet) {
        this._ios.snippet = snippet;
    }
    showInfoWindow() {
        this._ios.map.selectedMarker = this._ios;
    }
    isInfoWindowShown() {
        return this._ios.map.selectedMarker == this._ios;
    }
    hideInfoWindow() {
        this._ios.map.selectedMarker = null;
    }
    get color() {
        return this._color;
    }
    set color(value) {
        value = getColorHue(value);
        this._color = value;
        if (this._color) {
            this._ios.icon = Marker.getIconForColor(this._color / 360);
        }
        else {
            this._ios.icon = null;
        }
    }
    get icon() {
        return this._icon;
    }
    set icon(value) {
        if (typeof value === 'string') {
            var tempIcon = new Image();
            tempIcon.imageSource = ImageSource.fromResourceSync(String(value));
            value = tempIcon;
        }
        this._icon = value;
        this._ios.icon = (value) ? this._icon.imageSource.ios : null;
    }
    get alpha() {
        return this._alpha;
    }
    set alpha(value) {
        this._alpha = value;
        if (this._visible)
            this._ios.opacity = value;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        this._ios.opacity = (this._visible) ? this._alpha : 0;
    }
    get flat() {
        return this._ios.flat;
    }
    set flat(value) {
        this._ios.flat = value;
    }
    get anchor() {
        return [this._ios.groundAnchor.x, this._ios.groundAnchor.y];
    }
    set anchor(value) {
        this._ios.groundAnchor = CGPointMake(value[0], value[1]);
    }
    get draggable() {
        return this._ios.draggable;
    }
    set draggable(value) {
        this._ios.draggable = value;
    }
    get ios() {
        return this._ios;
    }
}
Marker.cachedColorIcons = {};
export class Polyline extends PolylineBase {
    constructor() {
        super();
        this._ios = GMSPolyline.new();
        this._points = [];
    }
    get clickable() {
        return this._ios.tappable;
    }
    set clickable(value) {
        this._ios.tappable = value;
    }
    get zIndex() {
        return this._ios.zIndex;
    }
    set zIndex(value) {
        this._ios.zIndex = value;
    }
    loadPoints() {
        var points = GMSMutablePath.new();
        this._points.forEach(function (point) {
            points.addCoordinate(point.ios);
        }.bind(this));
        this._ios.path = points;
    }
    reloadPoints() {
        this.loadPoints();
    }
    get width() {
        return this._ios.strokeWidth;
    }
    set width(value) {
        this._ios.strokeWidth = value;
    }
    get color() {
        return this._color;
    }
    set color(value) {
        this._color = value;
        this._ios.strokeColor = value.ios;
    }
    get geodesic() {
        return this._ios.geodesic;
    }
    set geodesic(value) {
        this._ios.geodesic = value;
    }
    get ios() {
        return this._ios;
    }
}
export class Polygon extends PolygonBase {
    constructor() {
        super();
        this._ios = GMSPolygon.new();
        this._points = [];
        this._holes = [];
    }
    get clickable() {
        return this._ios.tappable;
    }
    set clickable(value) {
        this._ios.tappable = value;
    }
    get zIndex() {
        return this._ios.zIndex;
    }
    set zIndex(value) {
        this._ios.zIndex = value;
    }
    loadPoints() {
        var points = GMSMutablePath.new();
        this._points.forEach((point) => {
            points.addCoordinate(point.ios);
        });
        this._ios.path = points;
    }
    loadHoles() {
        var holes = [];
        this._holes.forEach((hole) => {
            var points = GMSMutablePath.new();
            hole.forEach((point) => {
                points.addCoordinate(point.ios);
            });
            holes.push(points);
        });
        this._ios.holes = holes;
    }
    reloadPoints() {
        this.loadPoints();
    }
    reloadHoles() {
        this.loadHoles();
    }
    get strokeWidth() {
        return this._ios.strokeWidth;
    }
    set strokeWidth(value) {
        this._ios.strokeWidth = value;
    }
    get strokeColor() {
        return this._strokeColor;
    }
    set strokeColor(value) {
        this._strokeColor = value;
        this._ios.strokeColor = value.ios;
    }
    get fillColor() {
        return this._fillColor;
    }
    set fillColor(value) {
        this._fillColor = value;
        this._ios.fillColor = value.ios;
    }
    get ios() {
        return this._ios;
    }
}
export class Circle extends CircleBase {
    constructor() {
        super();
        this._ios = GMSCircle.new();
    }
    get clickable() {
        return this._ios.tappable;
    }
    set clickable(value) {
        this._ios.tappable = value;
    }
    get zIndex() {
        return this._ios.zIndex;
    }
    set zIndex(value) {
        this._ios.zIndex = value;
    }
    get center() {
        return this._center;
    }
    set center(value) {
        this._center = value;
        this._ios.position = value.ios;
    }
    get radius() {
        return this._ios.radius;
    }
    set radius(value) {
        this._ios.radius = value;
    }
    get strokeWidth() {
        return this._ios.strokeWidth;
    }
    set strokeWidth(value) {
        this._ios.strokeWidth = value;
    }
    get strokeColor() {
        return this._strokeColor;
    }
    set strokeColor(value) {
        this._strokeColor = value;
        this._ios.strokeColor = value.ios;
    }
    get fillColor() {
        return this._fillColor;
    }
    set fillColor(value) {
        this._fillColor = value;
        this._ios.fillColor = value.ios;
    }
    get ios() {
        return this._ios;
    }
}
