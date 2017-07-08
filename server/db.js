// A wrapper around a protocol buffer based database in one file.
// The wrapper takes care of reading and flushing the file and keeping track of
// history for backups.
// Only one class instance can handle the database on the system at once.

var promisify = require("util.promisify");
var voronoi = require("../proto/generated_js/voronoi_pb.js")
var Logger = require("./logger.js");
var lockFile = require("lockfile");
var fs = require("fs");
var onExit = require('on-exit');
var touch = require("touch");
var path = require("path");
var config = require("./config.js");

var kLockFile = path.join(__dirname, config.db.lock_file);
var kDbFile = path.join(__dirname, config.db.db_file);
var kDbHistory = path.join(__dirname, config.db.history_dir);

var log = new (require("./logger.js"))("db");

// One mutex per process.
// Inter-process locking is done with lockfile.
var AsyncLock = require('async-lock');
var flushLock = new AsyncLock();

module.exports = function () {
  var snapshot = null;
  var that = this;

  // Returns the current snapshot of the database.
  this.get = function () {
    return snapshot;
  };

  // Writes the current snapshot to the database file.
  // Returns a Promise.
  // This needs a lock because it's done in multiple async operations.
  this.flush = function () {
    return flushLock.acquire("whole-process", realFlush);
  };

  // vrati promise u kojem je baza inicijalizirana.
  this.initialize = function () {
    if (snapshot !== null) {
      return Promise.reject("already initialized.");
    }
    return takeLock()
      .then(readSnapshot)
      .then(parseSnapshot);
  };

  // The actual flush implementation that doesn't check if current version on
  // disk is same.
  function writeBytesToDisk(buffer, version) {
    // write latest binray.
    return promisify(fs.writeFile)(kDbFile, buffer)
      // write history snapshot
      .then(function () {
        historySnapshot = path.join(kDbHistory, version + ".pb");
        return promisify(fs.writeFile)(historySnapshot, buffer);
      })
      .then(function () {
        log("Written!");
      })
      .catch(function (err) {
        log("Failed!", err);
        return Promise.reject(err);
      });
  }

  // The flush implementation that doesn't do the locking.
  function realFlush() {
    bytes = snapshot.serializeBinary();
    version = (new Date()).getTime();
    log("Flushing the snapshot, " +
        "version: " + version +
        " length: " + bytes.length);
    return readSnapshot()
      .then(function (bytes_on_disk) {
        if (!bytesEqual(bytes, bytes_on_disk)) {
          return writeBytesToDisk(new Buffer(bytes), version); 
        } else {
          log("Nothing to do, verison on disk is equal.");
        }
      });
  }

  // Returns a promise with bytes from the snapshot.
  function readSnapshot() {
    return promisify(fs.readFile)(kDbFile)
      .catch(function (err) {
        if (err.code == "ENOENT") {
          log("Db doesn't exists, creating an empty one.");
          return touch(kDbFile).then(function () {
            return "";
          });
        } else {
          log("Unknown error while reading the snapshot.");
          return Promise.reject(err);
        }
      });
  }

  function takeLock() {
    log("Obtaining the db lock..");
    return promisify(lockFile.lock)(kLockFile);
  }

  function parseSnapshot(bytes) {
    log("Snapshot size: " + bytes.length);
    snapshot = voronoi.Db.deserializeBinary(bytes);
    log("user count: " + snapshot.getUserList().length);
    return that;
  }

  function bytesEqual(lhs, rhs) {
    if (lhs.length != rhs.length) {
      return false;
    }
    for (var i = 0; i < lhs.length; ++i) {
      if (lhs[i] != rhs[i]) {
        return false;
      }
    }
    return true;
  }
};


onExit(function () {
  log("on-exit: cleaning the lock.");
  lockFile.unlockSync(kLockFile);
});
