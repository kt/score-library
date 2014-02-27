goog.provide('ScoreLibrary.Score.KeyManager');
goog.require('ScoreLibrary.Score');

/**
 * @constructor
 */
ScoreLibrary.Score.KeyManager = function() {
};

ScoreLibrary.Score.KeyManager.prototype.clone = function(clone) {

    clone = clone ||
        new ScoreLibrary.Score.KeyManager();

    return ScoreLibrary.copyAttributes(clone, this);
};

ScoreLibrary.Score.KeyManager.prototype.debug = function(msg) {
    //console.log(msg);
};

ScoreLibrary.Score.KeyManager.prototype.reset = function() {

    var keys = ScoreLibrary.keys(this, /^\d+/);

    keys.forEach(function(key) {

        delete this[key];
    }, this);
};

ScoreLibrary.Score.KeyManager.prototype.bindKey = function(key_pitches, staff) {

    staff = staff || 1;

    var prop = 'key_pitches_' + staff;

    var old_pitches = this[prop];

    this[prop] = key_pitches;

    return old_pitches;
};

ScoreLibrary.Score.KeyManager.prototype.keyDescriptIt = function(pitch, staff) {

    staff = staff || 1;

    var prop = 'key_pitches_' + staff;

    if (!this[prop] ||
        !this[prop].some(
            ScoreLibrary.Score.Pitch.prototype.equalStepAlter, pitch)) {

        return false;
    }

    return true;
};

ScoreLibrary.Score.KeyManager.prototype.keyNaturalIt = function(pitch, staff) {

    staff = staff || 1;

    var prop = 'key_pitches_' + staff;

    if (this[prop] &&
        this[prop].some(
            ScoreLibrary.Score.Pitch.prototype.equalStep, pitch)) {

        return true;
    }

    return false;
};

ScoreLibrary.Score.KeyManager.prototype.register = function(pitch, staff) {
    return this.registerRepaired(pitch, staff)
};

ScoreLibrary.Score.KeyManager.prototype.registerOriginal = function(pitch, staff) {

    staff = staff || 1;

    if (!pitch.alter) {
        /* IGNORE */
        return true;
    }

    if (this.keyDescriptIt(pitch, staff)) {

        return false;
    }

    var prop = '';

    prop += pitch.getSteps();
    prop += staff;

    var alter = this[prop];

    if (alter === pitch.alter) {

        return false;
    }

    this[prop] = pitch.alter;

    return true;
};

ScoreLibrary.Score.KeyManager.prototype.registerRepaired = function(pitch, staff) {

    staff = staff || 1;

    var prop = '';

    prop += pitch.getSteps();
    prop += staff;

    if (!pitch.alter) {
        /* IGNORE */

        this.debug("A. KeyManager.register: pitch is natural (pretend to add): ret true");
        this.debug("A. KeyManager.register: natural " + pitch.getSteps() + "_" + staff + " step=" + pitch.step );

        if (this[prop] !== undefined) {
            this.debug("A.1 KeyManager.register: pitch was already registered with alter = " + this[prop]);

            if (this[prop] === 0) {
                this.debug("A.2 KeyManager.register: pitch is natural and natural sign already in place");
                return true;
            }

            this.debug("A.3 KeyManager.register: pitch was already registered with alter = " + this[prop] + " replaced with natural" );

            this[prop] = 0;
            this.debug("prop.value :" + this[prop]);
        } else {
            this.debug("A.4 KeyManager.register: pitch not registered");
            this[prop] = 0;
        }
        return true;
    }

    if (this.keyDescriptIt(pitch, staff)) {
        this.debug("B. KeyManager.register: already in key sig (not adding): ret false");
        return false;
    }

    var alter = this[prop];

    if (alter === pitch.alter) {

        return false;
    }

    this.debug("C. KeyManager.register: " + pitch.getSteps() + "_" + staff + " step=" + pitch.step + " alter=" + pitch.alter);
    this[prop] = pitch.alter;

    return true;
};

ScoreLibrary.Score.KeyManager.prototype.dump = function() {
    var keys = ScoreLibrary.keys(this, /^\d+/);

    keys.forEach(function(key) {
    }, this);
}

ScoreLibrary.Score.KeyManager.prototype.exist = function(pitch, staff) {

    staff = staff || 1;

    if (!pitch.alter) {

        return false;
    }

    if (this.keyDescriptIt(pitch, staff)) {

        return true;
    }

    var prop = '';

    prop += pitch.getSteps();
    prop += staff;

    var alter = this[prop];

    return (alter === pitch.alter);
};

ScoreLibrary.Score.KeyManager.prototype.naturalIt = function(pitch, staff) {

    staff = staff || 1;

    var prop = '';

    prop += pitch.getSteps();
    prop += staff;

    this[prop] = 0;
};

ScoreLibrary.Score.KeyManager.prototype.needNatural = function(pitch, staff) {

    staff = staff || 1;

    if (pitch.alter) {

        return false;
    }

    var prop = '';

    prop += pitch.getSteps();
    prop += staff;

    var alter = this[prop];
    if (alter === 0) {

        return false;
    }
    else if (alter) {

        return true;
    }

    if (this.keyNaturalIt(pitch, staff)) {

        return true;
    }

    return false;
};
/**
 * @author XiongWenjie <navigator117@gmail.com>
 * @license This file is part of
 * score-library <http://www.musicxml-viewer.com>.
 * score-library is free software:
 * you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * score-library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with score-library.
 * If not, see <http://www.gnu.org/licenses>.
 */
