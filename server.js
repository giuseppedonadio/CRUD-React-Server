/* eslint-disable no-param-reassign */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

const DATA_FILE = path.join(__dirname, 'data.json');


app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('/api/runs', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/runs', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const runs = JSON.parse(data);
    const newRun = {
      length: req.body.length,
      unit: req.body.unit,
      pace: req.body.pace,
      unitPace: req.body.unitPace,
      id: req.body.id,
    };
    runs.push(newRun);
    fs.writeFile(DATA_FILE, JSON.stringify(runs, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(runs);
    });
  });
});

app.put('/api/runs', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const runs = JSON.parse(data);
    runs.forEach((run) => {
      if (run.id === req.body.id) {
        run.length = req.body.length;
        run.unit = req.body.unit;
        run.pace = req.body.pace;
        run.unitPace = req.body.unitPace;
      }
    });
    fs.writeFile(DATA_FILE, JSON.stringify(runs, null, 4), () => {
      res.json({});
    });
  });
});

app.delete('/api/runs', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    let runs = JSON.parse(data);
    runs = runs.reduce((memo, run) => {
      if (run.id === req.body.id) {
        return memo;
      } else {
        return memo.concat(run);
      }
    }, []);
    fs.writeFile(DATA_FILE, JSON.stringify(runs, null, 4), () => {
      res.json({});
    });
  });
});

app.get('/runners', (_, res) => {
  setTimeout(() => {
    res.end();
  }, 5000);
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
