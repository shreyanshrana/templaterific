export const LOGGER = (serviceName: string) => {
  return `
    package logger

    import (
        "fmt"
        "io"
        "os"
        "path"
        "strings"

        "github.com/rs/zerolog"
        "gopkg.in/natefinch/lumberjack.v2"
    )

    type Logger struct {
        logger zerolog.Logger
    }

    var logger *Logger = nil

    func NewLogger() *Logger {
        // ensures that only one logger is created across the system
        if logger != nil {
            return logger
        }

        logger := Logger{}
        logLevel, ok := os.LookupEnv("LOG_LEVEL")
        if !ok {
            logLevel = "ERROR"
        }
        logLevel = strings.ToUpper(logLevel)
        logsDir, ok := os.LookupEnv("LOGS_DIR")
        if !ok {
            panic("Incorrect/Missing value for LOGS_DIR")
        }
        zerolog.SetGlobalLevel(getLogLevel(logLevel))
        zerolog.TimestampFieldName = "T"
        zerolog.LevelFieldName = "L"
        var writers []io.Writer
        writers = append(writers, zerolog.ConsoleWriter{
            Out: os.Stderr,
        })
        if err := os.MkdirAll(logsDir, 0o744); err != nil {
            fmt.Println(fmt.Sprintf("error: %v", err))
        }
        filewriter := &lumberjack.Logger{
            Filename:   path.Join(logsDir, "${serviceName}-api.log"),
            MaxBackups: 4,
            MaxSize:    5,
            MaxAge:     10,
        }
        writers = append(writers, filewriter)
        // output := os.Stdout
        logWriters := io.MultiWriter(writers...)
        // domain -> product -> component -> module
        logger.logger = zerolog.New(logWriters).
            With().
            Str("Service", "${serviceName}-api").
            Timestamp().Logger()

        newLogger := &logger
        return newLogger
    }

    func getLogLevel(logLevel string) zerolog.Level {
        switch strings.ToLower(logLevel) {
        case "trace":
            return zerolog.TraceLevel
        case "debug":
            return zerolog.DebugLevel
        case "info":
            return zerolog.InfoLevel
        case "warn":
            return zerolog.WarnLevel
        case "error":
            return zerolog.ErrorLevel
        case "panic":
            return zerolog.PanicLevel
        default:
            return zerolog.ErrorLevel
        }
    }

    func (al *Logger) Trace(message string) {
        // add context as mandatory field
        al.logger.Trace().Msg(message)
    }

    func (al *Logger) Debug(message string) {
        // add context as mandatory field
        al.logger.Debug().Msg(message)
    }

    func (al *Logger) Info(message string) {
        // add context as mandatory field
        al.logger.Info().Msg(message)
    }

    func (al *Logger) Warn(message string) {
        // add context as mandatory field
        al.logger.Warn().Msg(message)
    }

    func (al *Logger) Error(err error, message string) {
        // add context as mandatory field
        al.logger.Error().Err(err).Msg(message)
    }

    func (al *Logger) Fatal(err error, message string) {
        // add context as mandatory field
        al.logger.Fatal().Err(err).Msg(message)
    }

    func (al *Logger) Panic(err error, message string) {
        // add context as mandatory field
        al.logger.Panic().Err(err).Msg(message)
    }
`;
};
