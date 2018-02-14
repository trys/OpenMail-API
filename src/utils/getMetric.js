import aws from 'aws-sdk';
const cloudwatch = new aws.CloudWatch();

export default function getMetric(metric, startTime = Date.now(), campaignId) {
  return new Promise((resolve, reject) => {
    cloudwatch.getMetricStatistics(
      {
        MetricName: metric,
        Namespace: 'AWS/SES',
        Period: 300,
        StartTime: startTime,
        EndTime: new Date(),
        Dimensions: [
          {
            Name: 'campaign',
            Value: campaignId.toString(),
          },
        ],
        Statistics: ['Sum'],
      },
      (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      },
    );
  });
}
