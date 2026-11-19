#!/usr/bin/env python3
"""
Testes de integridade matemática e auditoria estatística dos dados do Provão T1.
"""

import json
import unittest
import os

class TestProvaoDataIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        summary_path = "public/data/provao_summary.json"
        candidates_path = "public/data/candidates.json"
        
        if not os.path.exists(summary_path) or not os.path.exists(candidates_path):
            raise FileNotFoundError("Execute scripts/parse_provao.py antes de rodar os testes.")
            
        with open(summary_path, "r", encoding="utf-8") as f:
            cls.summary = json.load(f)
            
        with open(candidates_path, "r", encoding="utf-8") as f:
            cls.candidates = json.load(f)

    def test_total_candidate_count(self):
        """Verifica se exatamente 689 candidatos foram extraídos do Comunicado 284."""
        self.assertEqual(len(self.candidates), 689)
        self.assertEqual(self.summary["kpis"]["total_evaluated"], 689)

    def test_score_sum_consistency(self):
        """Verifica se a soma das 10 disciplinas bate exatamente com o total para todos os 689 candidatos."""
        for c in self.candidates:
            self.assertEqual(
                sum(c["scores"]),
                c["total"],
                f"Soma incorreta para {c['nome']} (Pedido {c['pedido']})"
            )

    def test_approved_candidates_rules(self):
        """Verifica que NENHUM candidato com situação 'Alcançou os perfis de aprovação' tirou < 7 em disciplina ou < 80 no total."""
        approved = [c for c in self.candidates if c["situacao"] == "Alcançou os perfis de aprovação"]
        self.assertEqual(len(approved), 567)
        for c in approved:
            self.assertGreaterEqual(
                c["total"], 80,
                f"Aprovado {c['nome']} tem nota total {c['total']} < 80"
            )
            for sc in c["scores"]:
                self.assertGreaterEqual(
                    sc, 7,
                    f"Aprovado {c['nome']} tem nota de disciplina {sc} < 7"
                )

    def test_failed_discipline_profile_rules(self):
        """Verifica que todos os que não atingiram o perfil de disciplina tiveram pelo menos uma nota < 7."""
        failed_disc = [c for c in self.candidates if c["situacao"] == "Não atingiu o perfil de disciplina"]
        self.assertEqual(len(failed_disc), 101)
        for c in failed_disc:
            min_score = min(c["scores"])
            self.assertLess(
                min_score, 7,
                f"Candidato {c['nome']} marcado como 'Não atingiu perfil de disciplina' mas tem min_score={min_score}"
            )

    def test_failed_total_profile_rules(self):
        """Verifica que todos com 'Não atingiu o perfil total' tiraram nota < 80."""
        failed_total = [c for c in self.candidates if c["situacao"] == "Não atingiu o perfil total"]
        self.assertEqual(len(failed_total), 21)
        for c in failed_total:
            self.assertLess(
                c["total"], 80,
                f"Candidato {c['nome']} marcado como 'Não atingiu perfil total' tem total={c['total']} >= 80"
            )

    def test_cross_referencing_coverage(self):
        """Verifica que 100% dos candidatos cruzam com o banco da 1ª fase do Mesmo Barco."""
        for c in self.candidates:
            self.assertIn("segment", c)
            self.assertIn("rank_1a_fase", c)
            self.assertIsNotNone(c["rank_1a_fase"], f"Pedido {c['pedido']} não tem rank da 1ª fase")

    def test_disciplines_structure(self):
        """Verifica se as 10 disciplinas estão catalogadas corretamente com intervalos de 10 questões."""
        self.assertEqual(len(self.summary["disciplines"]), 10)
        for idx, d in enumerate(self.summary["disciplines"], 1):
            self.assertEqual(d["id"], idx)
            self.assertIn("average", d)
            self.assertIn("below_7_count", d)

if __name__ == "__main__":
    unittest.main()
