/**
 * Railway-domain data types for the ODPT API v4.
 */
import type { GeoJsonGeometry, MultilingualTitle, OdptResource } from "./common.js";

/**
 * Rail direction — `odpt:RailDirection` (e.g. inbound/outbound).
 */
export interface RailDirection extends OdptResource {
  "@type": "odpt:RailDirection";
  "owl:sameAs": string;
  "dc:title"?: string;
  "odpt:railDirectionTitle"?: MultilingualTitle;
}

/**
 * One stop in a railway's ordered station list (`odpt:stationOrder`).
 */
export interface StationOrder {
  /** Station ID (`odpt.Station:...`). */
  "odpt:station": string;
  /** Station name (multilingual). */
  "odpt:stationTitle"?: MultilingualTitle;
  /** 1-based order index along the railway. */
  "odpt:index": number;
}

/**
 * Railway line — `odpt:Railway`.
 */
export interface Railway extends OdptResource {
  "@type": "odpt:Railway";
  "owl:sameAs": string;
  "dc:title": string;
  "odpt:railwayTitle"?: MultilingualTitle;
  /** Reading (kana). */
  "odpt:kana"?: string;
  /** Operator ID. */
  "odpt:operator": string;
  /** Line code. */
  "odpt:lineCode"?: string;
  /** Line color (hex, e.g. `#0000ff`). */
  "odpt:color"?: string;
  /** Geometry of the line. */
  "ug:region"?: GeoJsonGeometry;
  /** RailDirection ID for the ascending direction. */
  "odpt:ascendingRailDirection"?: string;
  /** RailDirection ID for the descending direction. */
  "odpt:descendingRailDirection"?: string;
  /** Ordered list of stations on the line. */
  "odpt:stationOrder": StationOrder[];
}

/**
 * Railway fare between two stations — `odpt:RailwayFare`.
 */
export interface RailwayFare extends OdptResource {
  "@type": "odpt:RailwayFare";
  "owl:sameAs": string;
  /** Issued timestamp (ISO 8601). */
  "dct:issued"?: string;
  /** Valid-until timestamp (ISO 8601). */
  "dct:valid"?: string;
  "odpt:operator": string;
  "odpt:fromStation": string;
  "odpt:toStation": string;
  /** Adult ticket (paper) fare in yen. */
  "odpt:ticketFare": number;
  /** Adult IC card fare in yen. */
  "odpt:icCardFare"?: number;
  /** Child ticket (paper) fare in yen. */
  "odpt:childTicketFare"?: number;
  /** Child IC card fare in yen. */
  "odpt:childIcCardFare"?: number;
  "odpt:viaStation"?: string[];
  "odpt:viaRailway"?: string[];
  "odpt:ticketType"?: string;
  "odpt:paymentMethod"?: string[];
}

/**
 * Station — `odpt:Station`.
 */
export interface Station extends OdptResource {
  "@type": "odpt:Station";
  "owl:sameAs": string;
  "dc:title"?: string;
  "odpt:stationTitle"?: MultilingualTitle;
  "odpt:operator": string;
  "odpt:railway": string;
  "odpt:stationCode"?: string;
  /** Longitude (WGS84). */
  "geo:long"?: number;
  /** Latitude (WGS84). */
  "geo:lat"?: number;
  "ug:region"?: GeoJsonGeometry;
  /** Exit IDs. */
  "odpt:exit"?: string[];
  /** Connecting railway IDs. */
  "odpt:connectingRailway"?: string[];
  /** StationTimetable IDs available at this station. */
  "odpt:stationTimetable"?: string[];
  /** PassengerSurvey IDs available at this station. */
  "odpt:passengerSurvey"?: string[];
}

/**
 * One entry in a station timetable (`odpt:stationTimetableObject`).
 */
export interface StationTimetableObject {
  "odpt:arrivalTime"?: string;
  "odpt:departureTime"?: string;
  "odpt:originStation"?: string[];
  "odpt:destinationStation"?: string[];
  "odpt:viaStation"?: string[];
  "odpt:viaRailway"?: string[];
  "odpt:train"?: string;
  "odpt:trainNumber"?: string;
  "odpt:trainType"?: string;
  "odpt:trainName"?: MultilingualTitle[];
  "odpt:trainOwner"?: string;
  "odpt:isLast"?: boolean;
  "odpt:isOrigin"?: boolean;
  "odpt:platformNumber"?: number;
  "odpt:platformName"?: MultilingualTitle;
  "odpt:carComposition"?: number;
  "odpt:note"?: MultilingualTitle;
}

/**
 * Station timetable — `odpt:StationTimetable`.
 */
export interface StationTimetable extends OdptResource {
  "@type": "odpt:StationTimetable";
  "owl:sameAs": string;
  "dct:issued"?: string;
  "dct:valid"?: string;
  "odpt:operator": string;
  "odpt:railway": string;
  "odpt:railwayTitle"?: MultilingualTitle;
  "odpt:station"?: string;
  "odpt:stationTitle"?: MultilingualTitle;
  "odpt:railDirection"?: string;
  "odpt:calendar"?: string;
  "odpt:stationTimetableObject": StationTimetableObject[];
  "odpt:note"?: MultilingualTitle;
}

/**
 * Real-time train location — `odpt:Train`.
 */
export interface Train extends OdptResource {
  "@type": "odpt:Train";
  /** Valid-until timestamp (ISO 8601). */
  "dct:valid"?: string;
  "owl:sameAs": string;
  "odpt:operator": string;
  "odpt:railway": string;
  "odpt:railDirection"?: string;
  "odpt:trainNumber": string;
  "odpt:trainType"?: string;
  "odpt:trainName"?: MultilingualTitle;
  "odpt:fromStation"?: string;
  "odpt:toStation"?: string;
  "odpt:originStation"?: string[];
  "odpt:destinationStation"?: string[];
  "odpt:viaStation"?: string[];
  "odpt:viaRailway"?: string[];
  "odpt:trainOwner"?: string;
  "odpt:index"?: number;
  /** Delay in seconds. */
  "odpt:delay"?: number;
  "odpt:carComposition"?: number;
  "odpt:note"?: MultilingualTitle;
}

/**
 * Real-time train operation/service information — `odpt:TrainInformation`.
 */
export interface TrainInformation extends OdptResource {
  "@type": "odpt:TrainInformation";
  "dct:valid"?: string;
  "owl:sameAs": string;
  /** Time the information originated (ISO 8601). */
  "odpt:timeOfOrigin": string;
  "odpt:operator": string;
  "odpt:railway"?: string;
  "odpt:trainInformationStatus"?: MultilingualTitle;
  "odpt:trainInformationText"?: MultilingualTitle;
  "odpt:railDirection"?: string;
  "odpt:trainInformationArea"?: MultilingualTitle;
  "odpt:trainInformationKind"?: MultilingualTitle;
  "odpt:stationFrom"?: string;
  "odpt:stationTo"?: string;
  "odpt:trainInformationRange"?: MultilingualTitle;
  "odpt:trainInformationCause"?: MultilingualTitle;
  "odpt:transferRailways"?: string[];
  "odpt:resumeEstimate"?: string;
}

/**
 * One stop in a train timetable (`odpt:trainTimetableObject`).
 */
export interface TrainTimetableObject {
  "odpt:arrivalTime"?: string;
  "odpt:arrivalStation"?: string;
  "odpt:departureTime"?: string;
  "odpt:departureStation"?: string;
  "odpt:platformNumber"?: number;
  "odpt:platformName"?: MultilingualTitle;
  "odpt:note"?: MultilingualTitle;
}

/**
 * Train timetable — `odpt:TrainTimetable`.
 */
export interface TrainTimetable extends OdptResource {
  "@type": "odpt:TrainTimetable";
  "owl:sameAs": string;
  "dct:issued"?: string;
  "dct:valid"?: string;
  "odpt:operator": string;
  "odpt:railway": string;
  "odpt:railDirection"?: string;
  "odpt:calendar"?: string;
  "odpt:train"?: string;
  "odpt:trainNumber": string;
  "odpt:trainType"?: string;
  "odpt:trainName"?: MultilingualTitle;
  "odpt:trainOwner"?: string;
  "odpt:originStation"?: string[];
  "odpt:destinationStation"?: string[];
  "odpt:viaStation"?: string[];
  "odpt:viaRailway"?: string[];
  "odpt:previousTrainTimetable"?: string[];
  "odpt:nextTrainTimetable"?: string[];
  "odpt:trainTimetableObject": TrainTimetableObject[];
  "odpt:needExtraFee"?: boolean;
  "odpt:note"?: MultilingualTitle;
}

/**
 * Train type — `odpt:TrainType` (e.g. Local, Express).
 */
export interface TrainType extends OdptResource {
  "@type": "odpt:TrainType";
  "owl:sameAs": string;
  "odpt:operator": string;
  "dc:title"?: string;
  "odpt:trainTypeTitle"?: MultilingualTitle;
}

/**
 * One year's figure in a passenger survey (`odpt:passengerSurveyObject`).
 */
export interface PassengerSurveyObject {
  "odpt:surveyYear": number;
  /** Average number of passenger journeys per day. */
  "odpt:passengerJourneys": number;
}

/**
 * Passenger survey (boarding figures) — `odpt:PassengerSurvey`.
 */
export interface PassengerSurvey extends OdptResource {
  "@type": "odpt:PassengerSurvey";
  "owl:sameAs": string;
  "odpt:operator": string;
  "odpt:station": string[];
  "odpt:railway": string[];
  /** Whether the figures include alighting passengers. */
  "odpt:includeAlighting": boolean;
  "odpt:passengerSurveyObject": PassengerSurveyObject[];
}
