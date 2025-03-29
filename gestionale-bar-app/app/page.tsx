import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function BarManager() {
  const [weekForecast, setWeekForecast] = useState({ revenue: "", margin: "" });
  const [dayData, setDayData] = useState({
    date: "",
    revenue: "",
    barCost: "",
    kitchenCost: "",
    team: "",
  });
  const [records, setRecords] = useState([]);
  const [personnel, setPersonnel] = useState([
    { name: "Mario Rossi", dailyCost: 81 },
    { name: "Luigi Bianchi", dailyCost: 67.5 },
    { name: "Giulia Verdi", dailyCost: 60.75 },
  ]);

  const handleChange = (e, setFunc) => {
    setFunc((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateDailyCosts = (data) => {
    const selected = data.team.split(",").map((t) => t.trim());
    const totalPersonnelCost = personnel
      .filter((p) => selected.includes(p.name))
      .reduce((sum, p) => sum + p.dailyCost, 0);

    const totalCosts =
      parseFloat(data.barCost || 0) +
      parseFloat(data.kitchenCost || 0) +
      totalPersonnelCost;
    const revenue = parseFloat(data.revenue || 0);
    const margin = revenue - totalCosts;
    const marginPerc = revenue > 0 ? margin / revenue : 0;

    return {
      totalPersonnelCost,
      totalCosts,
      margin,
      marginPerc,
      breakEven: totalCosts,
    };
  };

  const currentDayResults = calculateDailyCosts(dayData);
  const weeklySpendingLimit =
    parseFloat(weekForecast.revenue || 0) * (1 - parseFloat(weekForecast.margin || 0));

  const handleAddRecord = () => {
    const calculations = calculateDailyCosts(dayData);
    const newRecord = { ...dayData, ...calculations };
    setRecords([...records, newRecord]);
    setDayData({ date: "", revenue: "", barCost: "", kitchenCost: "", team: "" });
  };

  return (
    <div className="grid gap-4 p-4">
      <Card>
        <CardContent className="grid gap-2">
          <h2 className="text-xl font-semibold">Previsione Settimanale</h2>
          <Input
            name="revenue"
            placeholder="Incasso previsto (€)"
            value={weekForecast.revenue}
            onChange={(e) => handleChange(e, setWeekForecast)}
          />
          <Input
            name="margin"
            placeholder="Margine obiettivo (es. 0.35)"
            value={weekForecast.margin}
            onChange={(e) => handleChange(e, setWeekForecast)}
          />
          <div>Spesa massima settimanale: € {weeklySpendingLimit.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-2">
          <h2 className="text-xl font-semibold">Dati Giornalieri</h2>
          <Input
            name="date"
            placeholder="Data"
            value={dayData.date}
            onChange={(e) => handleChange(e, setDayData)}
          />
          <Input
            name="revenue"
            placeholder="Incasso del giorno (€)"
            value={dayData.revenue}
            onChange={(e) => handleChange(e, setDayData)}
          />
          <Input
            name="barCost"
            placeholder="Spese Bar (€)"
            value={dayData.barCost}
            onChange={(e) => handleChange(e, setDayData)}
          />
          <Input
            name="kitchenCost"
            placeholder="Spese Cucina (€)"
            value={dayData.kitchenCost}
            onChange={(e) => handleChange(e, setDayData)}
          />
          <Input
            name="team"
            placeholder="Team (nomi separati da virgola)"
            value={dayData.team}
            onChange={(e) => handleChange(e, setDayData)}
          />
          <div>Costo personale: € {currentDayResults.totalPersonnelCost.toFixed(2)}</div>
          <div>Spese totali: € {currentDayResults.totalCosts.toFixed(2)}</div>
          <div>Margine: € {currentDayResults.margin.toFixed(2)}</div>
          <div>Margine %: {(currentDayResults.marginPerc * 100).toFixed(2)}%</div>
          <div>Break-even del giorno: € {currentDayResults.breakEven.toFixed(2)}</div>
          <button onClick={handleAddRecord}>Salva Giornata</button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Storico Giornaliero</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Incasso</TableHead>
                <TableHead>Bar</TableHead>
                <TableHead>Cucina</TableHead>
                <TableHead>Personale</TableHead>
                <TableHead>Spese Totali</TableHead>
                <TableHead>Margine</TableHead>
                <TableHead>%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((rec, i) => (
                <TableRow key={i}>
                  <TableCell>{rec.date}</TableCell>
                  <TableCell>€ {rec.revenue}</TableCell>
                  <TableCell>€ {rec.barCost}</TableCell>
                  <TableCell>€ {rec.kitchenCost}</TableCell>
                  <TableCell>€ {rec.totalPersonnelCost.toFixed(2)}</TableCell>
                  <TableCell>€ {rec.totalCosts.toFixed(2)}</TableCell>
                  <TableCell>€ {rec.margin.toFixed(2)}</TableCell>
                  <TableCell>{(rec.marginPerc * 100).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}