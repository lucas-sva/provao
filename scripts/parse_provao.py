#!/usr/bin/env python3
"""
Script de extração, auditoria e enriquecimento dos dados do Provão T1 (PC-CE).
Fonte: Comunicado Nº 284/2026-CEV/UECE cruzado com o banco do Mesmo Barco.
"""

import os
import re
import json
import subprocess
import urllib.request
from collections import Counter

DISCIPLINES = [
    {"id": 1, "code": "D01", "name": "Gestão de Expedientes e Proc. Cartorários", "short": "Cartorários", "range": "01 a 10"},
    {"id": 2, "code": "D02", "name": "Gestão de Seção de Investig. e Operações", "short": "Seção Investig./Op.", "range": "11 a 20"},
    {"id": 3, "code": "D03", "name": "Relatório de Investigação", "short": "Relatório Investig.", "range": "21 a 30"},
    {"id": 4, "code": "D04", "name": "Sistemas de Informações Policiais", "short": "Sistemas Policiais", "range": "31 a 40"},
    {"id": 5, "code": "D05", "name": "Preservação da Prova e Local do Crime", "short": "Preservação/Local", "range": "41 a 50"},
    {"id": 6, "code": "D06", "name": "Investigação de Homicídios e Feminicídios", "short": "Homicídios/Femin.", "range": "51 a 60"},
    {"id": 7, "code": "D07", "name": "Investigação de Tráfico de Drogas", "short": "Tráfico de Drogas", "range": "61 a 70"},
    {"id": 8, "code": "D08", "name": "Investigação de Crimes Contra o Patrimônio", "short": "Crimes Patrimônio", "range": "71 a 80"},
    {"id": 9, "code": "D09", "name": "Investig. de Corrupção e Contra Adm. Pública", "short": "Corrupção/Adm. Púb.", "range": "81 a 90"},
    {"id": 10, "code": "D10", "name": "Extração de Dados de Dispositivos Móveis", "short": "Extração Celulares", "range": "91 a 100"},
]

def main():
    pdf_path = "data/comunicado2842026cev.pdf"
    if not os.path.exists(pdf_path):
        if os.path.exists("comunicado2842026cev.pdf"):
            pdf_path = "comunicado2842026cev.pdf"
        else:
            raise FileNotFoundError(f"PDF {pdf_path} não encontrado.")

    print(f"Extraindo texto de {pdf_path}...")
    txt_path = "/tmp/comunicado_extracted.txt"
    subprocess.run(["pdftotext", "-layout", pdf_path, txt_path], check=True)

    with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Regex para capturar linhas de dados
    # Linha exemplo: "  4519   ABIDIEL DAS NEVES SILVA  10  8  9  9 10  9 10  9  9  9   92 Alcançou os perfis de aprovação"
    pattern = re.compile(
        r'^\s*(\d+)\s+([^\d\n]+?)\s+'
        r'(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+'
        r'(\d+)\s+(Alcançou os perfis de aprovação|Não atingiu o perfil de disciplina|Não atingiu o perfil total|Faltoso.*)$',
        re.MULTILINE
    )

    matches = pattern.findall(content)
    print(f"Total de candidatos encontrados no PDF: {len(matches)}")

    # Obter dados da 1ª fase do Mesmo Barco
    mesmo_barco_url = "https://raw.githubusercontent.com/lucas-sva/mesmo-barco/main/data/candidates.json"
    cache_mb_path = "data/mesmo_barco_candidates.json"

    if not os.path.exists(cache_mb_path):
        print(f"Baixando base do Mesmo Barco de {mesmo_barco_url}...")
        try:
            req = urllib.request.Request(mesmo_barco_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp:
                with open(cache_mb_path, "wb") as f:
                    f.write(resp.read())
            print("Download concluído com sucesso.")
        except Exception as e:
            print(f"Aviso ao baixar do GitHub: {e}. Usando fallback caso exista.")

    mb_map = {}
    if os.path.exists(cache_mb_path):
        with open(cache_mb_path, "r", encoding="utf-8") as f:
            mb_list = json.load(f)
            mb_map = {c["pedido"]: c for c in mb_list}
        print(f"Base Mesmo Barco carregada com {len(mb_map)} registros.")

    candidates = []
    for m in matches:
        pedido = int(m[0])
        nome = m[1].strip().replace("C?MARA", "CÂMARA").replace("ALC?NTARA", "ALCÂNTARA")
        scores = [int(m[i]) for i in range(2, 12)]
        total = int(m[12])
        situacao = m[13].strip()

        # Auditoria matemática de consistência
        if sum(scores) != total:
            print(f"ERRO DE SOMA: {nome} (Pedido {pedido}) - Soma={sum(scores)} != Total={total}")

        # Auditoria das regras da CEV/UECE
        min_disc = min(scores)
        has_min_disciplina = (min_disc >= 7)
        has_min_total = (total >= 80)

        # Enriquecimento com 1ª fase
        mb_info = mb_map.get(pedido, {})
        segment = mb_info.get("segment", "Ampla")
        rank_1a_fase = mb_info.get("rank_geral", None)
        scores_1a = mb_info.get("scores", {})
        nota_objetiva_1a = scores_1a.get("objetiva", None)
        nota_discursiva_1a = scores_1a.get("discursiva", None)
        nota_total_1a = scores_1a.get("total", None)
        sexo = mb_info.get("sex", None)

        # Identificar disciplinas onde tirou nota < 7
        failing_disciplines = [
            DISCIPLINES[idx]["code"] for idx, sc in enumerate(scores) if sc < 7
        ]

        candidates.append({
            "pedido": pedido,
            "nome": nome,
            "scores": scores,
            "total": total,
            "situacao": situacao,
            "min_disc": min_disc,
            "failing_disciplines": failing_disciplines,
            "num_failing_disciplines": len(failing_disciplines),
            "segment": segment,
            "rank_1a_fase": rank_1a_fase,
            "nota_objetiva_1a": nota_objetiva_1a,
            "nota_discursiva_1a": nota_discursiva_1a,
            "nota_total_1a": nota_total_1a,
            "sexo": sexo
        })

    # Ordenar por nota do provão decrescente (e desempate por nota na 1ª fase se disponível)
    candidates.sort(key=lambda c: (c["total"], c["nota_total_1a"] or 0), reverse=True)
    for rank_idx, c in enumerate(candidates, 1):
        c["rank_provao"] = rank_idx
        if c["rank_1a_fase"]:
            # Delta de posições: se rank_1a era 200 e rank_provao é 50, delta = +150 (subiu 150 posições)
            c["rank_delta"] = c["rank_1a_fase"] - c["rank_provao"]
        else:
            c["rank_delta"] = 0

    print(f"Candidatos processados: {len(candidates)}")

    # Geração das estatísticas consolidadas para provao_summary.json
    total_candidates = len(candidates)
    aprovados = [c for c in candidates if c["situacao"] == "Alcançou os perfis de aprovação"]
    reprovados_disc = [c for c in candidates if c["situacao"] == "Não atingiu o perfil de disciplina"]
    reprovados_total = [c for c in candidates if c["situacao"] == "Não atingiu o perfil total"]

    all_totals = [c["total"] for c in candidates]
    avg_total = sum(all_totals) / total_candidates
    sorted_totals = sorted(all_totals)
    median_total = sorted_totals[total_candidates // 2]

    # Estatísticas por disciplina
    disc_stats = []
    for idx, d in enumerate(DISCIPLINES):
        scores_d = [c["scores"][idx] for c in candidates]
        avg_d = sum(scores_d) / len(scores_d)
        below_7_count = sum(1 for s in scores_d if s < 7)
        below_6_count = sum(1 for s in scores_d if s < 6)
        
        # Alunos onde esta disciplina foi a ÚNICA causadora da reprovação
        sole_cause_count = sum(
            1 for c in reprovados_disc if c["failing_disciplines"] == [d["code"]]
        )

        # Distribuição de notas (quantos tiraram 10, 9, 8, 7, 6, 5...)
        score_freq = Counter(scores_d)
        distribution = {str(k): score_freq.get(k, 0) for k in range(0, 11)}

        disc_stats.append({
            "id": d["id"],
            "code": d["code"],
            "name": d["name"],
            "short": d["short"],
            "range": d["range"],
            "average": round(avg_d, 2),
            "max": max(scores_d),
            "min": min(scores_d),
            "below_7_count": below_7_count,
            "below_7_pct": round(below_7_count / total_candidates * 100, 2),
            "below_6_count": below_6_count,
            "sole_cause_count": sole_cause_count,
            "distribution": distribution
        })

    # Ranking de vilãs (ordenado por quantas reprovações causou)
    villain_ranking = sorted(disc_stats, key=lambda d: d["below_7_count"], reverse=True)

    # Histograma de pontuações totais (faixas de 5 em 5 pontos)
    # 0-59, 60-64, 65-69, 70-74, 75-79, 80-84, 85-89, 90-94, 95-100
    buckets = [
        {"range": "< 60", "min": 0, "max": 59, "count": 0, "approved": 0, "failed_disc": 0, "failed_total": 0},
        {"range": "60-69", "min": 60, "max": 69, "count": 0, "approved": 0, "failed_disc": 0, "failed_total": 0},
        {"range": "70-74", "min": 70, "max": 74, "count": 0, "approved": 0, "failed_disc": 0, "failed_total": 0},
        {"range": "75-79", "min": 75, "max": 79, "count": 0, "approved": 0, "failed_disc": 0, "failed_total": 0},
        {"range": "80-84", "min": 80, "max": 84, "count": 0, "approved": 0, "failed_disc": 0, "failed_total": 0},
        {"range": "85-89", "min": 85, "max": 89, "count": 0, "approved": 0, "failed_disc": 0, "failed_total": 0},
        {"range": "90-94", "min": 90, "max": 94, "count": 0, "approved": 0, "failed_disc": 0, "failed_total": 0},
        {"range": "95-100", "min": 95, "max": 100, "count": 0, "approved": 0, "failed_disc": 0, "failed_total": 0},
    ]

    for c in candidates:
        tot = c["total"]
        for b in buckets:
            if b["min"] <= tot <= b["max"]:
                b["count"] += 1
                if c["situacao"] == "Alcançou os perfis de aprovação":
                    b["approved"] += 1
                elif c["situacao"] == "Não atingiu o perfil de disciplina":
                    b["failed_disc"] += 1
                else:
                    b["failed_total"] += 1
                break

    # Top notas que foram reprovadas (choque de realidade)
    top_failed_scores = []
    for c in sorted(reprovados_disc, key=lambda x: x["total"], reverse=True)[:10]:
        top_failed_scores.append({
            "nome": c["nome"],
            "total": c["total"],
            "pedido": c["pedido"],
            "failing_disciplines": [
                f"{d['short']} ({c['scores'][d['id']-1]} pts)"
                for d in DISCIPLINES if c["scores"][d["id"]-1] < 7
            ]
        })

    # Estatísticas de alunos que caíram por apenas 1 matéria
    sole_disc_fails = sum(1 for c in reprovados_disc if c["num_failing_disciplines"] == 1)
    two_disc_fails = sum(1 for c in reprovados_disc if c["num_failing_disciplines"] == 2)

    summary = {
        "metadata": {
            "source": "Comunicado Nº 284/2026-CEV/UECE de 14/10/2026",
            "exam_date": "27/09/2026",
            "total_candidates": total_candidates,
            "disciplines_count": 10,
            "questions_count": 100,
        },
        "kpis": {
            "total_evaluated": total_candidates,
            "approved_count": len(aprovados),
            "approved_pct": round(len(aprovados) / total_candidates * 100, 2),
            "failed_disc_count": len(reprovados_disc),
            "failed_disc_pct": round(len(reprovados_disc) / total_candidates * 100, 2),
            "failed_total_count": len(reprovados_total),
            "failed_total_pct": round(len(reprovados_total) / total_candidates * 100, 2),
            "total_failed_count": len(reprovados_disc) + len(reprovados_total),
            "total_failed_pct": round((len(reprovados_disc) + len(reprovados_total)) / total_candidates * 100, 2),
            "avg_score": round(avg_total, 2),
            "median_score": median_total,
            "max_score": max(all_totals),
            "min_score": min(all_totals),
            "sole_discipline_fail_count": sole_disc_fails,
            "sole_discipline_fail_pct": round(sole_disc_fails / len(reprovados_disc) * 100, 1) if reprovados_disc else 0,
            "two_discipline_fail_count": two_disc_fails,
        },
        "disciplines": disc_stats,
        "villain_ranking": villain_ranking,
        "histogram": buckets,
        "top_failed_scores": top_failed_scores
    }

    # Salvar arquivos JSON estáticos
    os.makedirs("public/data", exist_ok=True)
    with open("public/data/provao_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print("public/data/provao_summary.json salvo.")

    with open("public/data/candidates.json", "w", encoding="utf-8") as f:
        json.dump(candidates, f, ensure_ascii=False)
    print("public/data/candidates.json salvo.")

if __name__ == "__main__":
    main()
