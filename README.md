# node-red-contrib-excursion
A node that monitors a value for sustained excursions from a range

You can find source code and more information here:

- GitHub:  https://github.com/clough42/node-red-contrib-excursion
- NpmJS:  https://www.npmjs.com/package/node-red-contrib-excursion
- Node-Red:  http://flows.nodered.org/node/node-red-contrib-excursion

Use this node to process a stream of sensor values and ensure that they
remain in a defined range.  This node monitors two ranges: a soft range and
a hard range.
If the value leaves the soft range, the node starts monitoring the value and
only reports if it does not return to the soft range within the specified
period of time.  If
the value returns to the soft range within the defined time period,
no report is made.  If the value leaves the hard range, it is reported
immediately.

Once an excursion is reported (hard or soft) all messages are passed through
the node until the value returns to the soft range, at which point the node
resets.

This is useful for monitoring systems like refrigerators that must
remain in a safe range, but may experience brief excursions (from the soft
range) when the door is opened.  The hard range provides a way to set an
absolute limit for soft excursions.


## Settings

- `Name` - The name to display for this node.  Leave blank to use the default.
- `Time` - The allowable excursion time, in seconds, for the
soft range.  If the value
remains outside the soft range for this period of time, the last
message is sent to output 1 and all subsequent messages also outside of
the soft range are sent as well.  Leave this field unset to disable
the timer and report all excursions immediately.
- `Hard Max` - The maximum allowable numeric value for the hard
range.  This value will be
compared to the message payload to determine if it is inside the range.
Leave this field blank if there is no hard maximum.
- `Soft Max` - The maximum allowable numeric value for the soft
range.  This value will be
compared to the message payload to determine if it is inside the range.
Leave this field blank if there is no soft maximum.
- `Soft Min` - The minimum allowable numeric value for the soft
range.  This value will be
compared to the message payload to determine if it is inside the range.
Leave this field blank if there is no soft minimum.
- `Hard Min` - The minimum allowable numeric value for the hard
range.  This value will be
compared to the message payload to determine if it is inside the range.
Leave this field blank if there is no hard minimum.

## Logging

The node logs when it receives a value outside of the allowable range
and again when the timer expires and the message is sent.

## Status

While it is running, the node displays its status:

- 'OK' - The value is in the allowable range.
- 'Soft excursion...' - The most recent value is outside the soft range.  The timer is running.
- 'Excursion!' - An excursion has been triggered and data is being sent to the output.
- 'Waiting for data' - No data values have arrived yet.