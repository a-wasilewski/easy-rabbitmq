const amqp = require('amqplib')

var amqpConnector = function (uri, queue) {
    var exports = {}

    this.uri = uri
    this.queue = queue

    amqp.connect(this.uri)
        .then((conn) => {
            this.connection = conn
            return this.connection.createChannel()
        })
        .then((ch) => {
            this.channel = ch
            this.channel.assertQueue(this.queue, { durable: true })
        })
        .catch(function (err) {
            console.error(err)
        })

    function defaultCallback(message) { console.log(message) }

    exports.receive = (callback = this.defaultCallback) => {
        try {
            this.channel.consume(this.queue, (message) => {
                if (message != null) {
                    callback(message.content.toString())
                    this.channel.ack(message)
                }
            }, { noAck: false })
        } catch (error) {
            console.error(error)
        }
    }

    exports.send = (message) => {
        try {
            this.channel.sendToQueue(this.queue, Buffer.from(message), { persistent: true })
        } catch (error) {
            console.error(error)
        }
    }

    exports.close = () => {
        this.channel.close()
        this.connection.close()
    }

    return exports
}

<<<<<<< HEAD
module.exports.amqpConnector = amqpConnector
=======
module.exports = amqpConnector
>>>>>>> _checkReady
