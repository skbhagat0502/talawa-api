import type { Types, PopulatedDoc, Document, Model } from "mongoose";
import { Schema, model, models } from "mongoose";
import type { InterfaceOrganization } from "./Organization";
import type { InterfaceUser } from "./User";
import type { InterfaceRecurrenceRule } from "./RecurrenceRule";
import { createLoggingMiddleware } from "../libraries/dbLogger";

/**
 * This is an interface representing a document for an event in the database(MongoDB).
 */
export interface InterfaceEvent {
  _id: Types.ObjectId;
  title: string;
  description: string;
  attendees: string | undefined;
  location: string | undefined;
  latitude: number | undefined;
  longitude: number;
  recurring: boolean;
  isRecurringEventException: boolean;
  isBaseRecurringEvent: boolean;
  recurrenceRuleId: PopulatedDoc<InterfaceRecurrenceRule & Document>;
  baseRecurringEventId: PopulatedDoc<InterfaceEvent & Document>;
  allDay: boolean;
  startDate: string;
  endDate: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  recurrance: string;
  isPublic: boolean;
  isRegisterable: boolean;
  creatorId: PopulatedDoc<InterfaceUser & Document>;
  admins: PopulatedDoc<InterfaceUser & Document>[];
  organization: PopulatedDoc<InterfaceOrganization & Document>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * This is the Structure of the Event
 * @param title - Title of the event
 * @param description - Description of the event
 * @param attendees - Attendees
 * @param location - Location of the event
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @param recurring - Is the event recurring
 * @param isRecurringEventException - Is the event an exception to the recurring pattern it was following
 * @param isBaseRecurringEvent - Is the event a true recurring event that is used for generating new instances
 * @param recurrenceRuleId - Id of the recurrence rule document containing the recurrence pattern for the event
 * @param baseRecurringEventId - Id of the true recurring event used for generating this instance
 * @param allDay - Is the event occuring all day
 * @param startDate - Start Date
 * @param endDate - End date
 * @param startTime - Start Time
 * @param endTime - End Time
 * @param recurrance - Periodicity of recurrance of the event
 * @param isPublic - Is the event public
 * @param isRegisterable - Is the event Registrable
 * @param creatorId - Creator of the event
 * @param admins - Admins
 * @param organization - Organization
 * @param status - whether the event is active, blocked, or deleted.
 * @param createdAt - Timestamp of event creation
 * @param updatedAt - Timestamp of event updation
 */

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    attendees: {
      type: String,
      required: false,
    },
    location: {
      type: String,
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    recurring: {
      type: Boolean,
      required: true,
      default: false,
    },
    isRecurringEventException: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBaseRecurringEvent: {
      type: Boolean,
      required: true,
      default: false,
    },
    recurrenceRuleId: {
      type: Schema.Types.ObjectId,
      ref: "RecurrenceRule",
      required: false,
    },
    baseRecurringEventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: false,
    },
    allDay: {
      type: Boolean,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    startTime: {
      type: Date,
      required: function (this: InterfaceEvent): boolean {
        return !this.allDay;
      },
    },
    endTime: {
      type: Date,
      required: function (this: InterfaceEvent): boolean {
        return !this.allDay;
      },
    },
    recurrance: {
      type: String,
      required: function (this: InterfaceEvent): boolean {
        return this.recurring;
      },
      enum: ["ONCE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
      default: "ONCE",
    },
    isPublic: {
      type: Boolean,
      required: true,
    },
    isRegisterable: {
      type: Boolean,
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "BLOCKED", "DELETED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

createLoggingMiddleware(eventSchema, "Event");

const eventModel = (): Model<InterfaceEvent> =>
  model<InterfaceEvent>("Event", eventSchema);

// This syntax is needed to prevent Mongoose OverwriteModelError while running tests.
export const Event = (models.Event || eventModel()) as ReturnType<
  typeof eventModel
>;
