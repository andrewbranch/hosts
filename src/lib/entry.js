function Entry(ip, hostname, text) {
  this.ip = ip;
  this.hostname = hostname;
  this.tail = text.split(ip)[1].split(hostname)[1]
}

Entry.prototype.toString = function() {
  return [this.ip, ' ', this.hostname, this.tail].join('');
};

module.exports = Entry;
