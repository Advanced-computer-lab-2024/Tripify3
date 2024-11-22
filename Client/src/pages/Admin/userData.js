import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box, Card, CardContent, Grid } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const UserData = () => {
  const [data, setData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userTypeCounts, setUserTypeCounts] = useState([]);
  const [monthlyUsers, setMonthlyUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/admin/getAllUsers").then((response) => {
      const users = response.data.users;
      setTotalUsers(response.data.totalCount);

      // Count users by type
      const typeCounts = users.reduce((acc, user) => {
        acc[user.type] = (acc[user.type] || 0) + 1;
        return acc;
      }, {});
      setUserTypeCounts(
        Object.entries(typeCounts).map(([type, count]) => ({ name: type, value: count }))
      );

      // Count users by join month
      const monthCounts = users.reduce((acc, user) => {
        const month = new Date(user.joinDate).toLocaleString("default", { month: "short" });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});
      setMonthlyUsers(
        Object.entries(monthCounts).map(([month, count]) => ({ month, count }))
      );

      setData(users);
    });
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57"];

  return (
    <Box sx={{ padding: 4 }}>
      {/* Total Users */}
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h4" align="center">
            Total Users: {totalUsers}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Pie Chart: User Types */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                User Types Distribution
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={userTypeCounts}
                  cx="50%"
                  cy="50%"
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeCounts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart: Monthly Users */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Monthly User Registrations
              </Typography>
              <BarChart width={400} height={300} data={monthlyUsers}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserData;
